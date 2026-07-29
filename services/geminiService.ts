
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentaryScript, ScriptRequest, Scene, Shot, VisualAsset } from "../types";

const SYSTEM_INSTRUCTIONS = `
Bạn là Hệ thống Biên kịch Phim tài liệu và Chuyên gia Prompt Visual cấp sản xuất.
Nhiệm vụ: Tạo kịch bản Voice-over (VO) chuyên nghiệp và prompt hình ảnh nhất quán tuyệt đối.

🎯 QUY TẮC TUÂN THỦ SỐ LƯỢNG PHÂN CẢNH:
- Bạn PHẢI tạo ra chính xác số lượng phân cảnh (scene count) như được yêu cầu.
- Mảng 'scenes' trong kết quả JSON PHẢI có độ dài bằng đúng con số này.

🎯 TỐI ƯU ĐỊNH DANH THƯƠNG HIỆU:
- Kịch bản PHẢI phản ánh chính xác VAI TRÒ, NGÁCH NỘI DUNG và BẢN SẮC CỦA KÊNH.

🎯 CHIẾN LƯỢC NHẤT QUÁN THỊ GIÁC (VISUAL CONSISTENCY STRATEGY):
1. PHÂN TÍCH CHỦ THỂ (SUBJECT ANCHORING): Xác định một thực thể hoặc nhân vật chính xuyên suốt. Mô tả thực thể này bằng các từ khóa đặc thù và lặp lại chúng trong MỌI prompt.
2. BẢNG MÀU ĐỒNG BỘ (COLOR PALETTE): Sử dụng một dải màu cố định cho toàn bộ kịch bản dựa trên visual style đã chọn.
3. PHONG CÁCH NGHỆ THUẬT (COHERENT ART STYLE): Không thay đổi nét vẽ hay chất liệu giữa các cảnh. Nếu là "Ghibli", mọi cảnh phải có chất liệu màu nước và ánh sáng đặc trưng của Ghibli.
4. KHÔNG GIAN LIÊN TỤC (ENVIRONMENTAL CONTINUITY): Nếu các cảnh diễn ra trong cùng một bối cảnh, hãy đảm bảo các chi tiết nền không thay đổi đột ngột.

🧬 PHONG CÁCH HÌNH ẢNH LEE BIZ (NẾU ĐƯỢC CHỌN):
- Viết prompt 100% bằng tiếng Việt.
- KHÔNG có con người, KHÔNG có chữ, KHÔNG có nhãn mác.
- Sạch, trung tính, minh họa khoa học rõ ràng.

ĐỊNH ĐẠNG ĐẦU RA: Tuân thủ JSON Schema. Prompt phải mô tả chi tiết, giàu tính điện ảnh và gắn kết với nhau như một bộ phim duy nhất.
`;

const VISUAL_ASSET_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scene_id: { type: Type.INTEGER },
    whisk_image_prompt: { type: Type.STRING, description: "Prompt ảnh nhất quán: Phải chứa các từ khóa định danh chủ thể và phong cách đã thiết lập cho toàn bộ phim." },
    veo3_video_prompt: { type: Type.STRING, description: "Prompt video nhất quán: Mô tả chuyển động camera mượt mà, đồng bộ với phong cách thị giác chung." },
    aesthetic_tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tags: Phong cách, tông màu chủ đạo, cảm xúc thị giác lặp lại." },
    shot_type: { type: Type.STRING },
    camera_angle: { type: Type.STRING },
    lighting_style: { type: Type.STRING },
    recommended_image_count: { type: Type.INTEGER }
  },
  required: ["scene_id", "whisk_image_prompt", "veo3_video_prompt", "aesthetic_tags", "shot_type", "camera_angle", "lighting_style", "recommended_image_count"],
};

const SCENE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER },
    structure_step: { type: Type.STRING },
    time_range: { type: Type.STRING },
    duration_seconds: { type: Type.NUMBER },
    narration: { type: Type.STRING, description: "Lời bình được tối ưu ký tự để khớp thời lượng." },
    visual_prompt: { type: Type.STRING },
  },
  required: ["id", "structure_step", "time_range", "duration_seconds", "narration", "visual_prompt"],
};

const SCRIPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    project_spec: {
      type: Type.OBJECT,
      properties: {
        target: {
          type: Type.OBJECT,
          properties: { country: { type: Type.STRING }, language: { type: Type.STRING } },
        },
        identity: {
          type: Type.OBJECT,
          properties: {
            narrator_role: { type: Type.STRING },
            content_niche: { type: Type.STRING },
            channel_name: { type: Type.STRING },
            narrator_name: { type: Type.STRING },
          }
        }
      },
    },
    language_pack: {
      type: Type.OBJECT,
      properties: { anti_translationese_rules: { type: Type.ARRAY, items: { type: Type.STRING } } }
    },
    topic_pack: {
      type: Type.OBJECT,
      properties: { narrative_rules: { type: Type.ARRAY, items: { type: Type.STRING } } }
    },
    scenes: { type: Type.ARRAY, items: SCENE_SCHEMA },
  },
  required: ["title", "scenes", "language_pack", "topic_pack", "project_spec"],
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateScript(params: ScriptRequest): Promise<DocumentaryScript> {
    const minutes = params.duration / 60;
    const isAsianLang = /ja|ko|zh/i.test(params.language);
    const targetChars = isAsianLang ? Math.floor(minutes * 380) : Math.floor(minutes * 150 * 5.8);
    const minChars = Math.floor(targetChars * 0.985);
    const maxChars = Math.floor(targetChars * 1.015);

    const prompt = `
      SẢN XUẤT KỊCH BẢN VOICE (BRANDED & LOCALIZED):
      - CHỦ ĐỀ: ${params.topic}
      - ĐỊNH DANH: Kênh ${params.channel_name}, vai trò ${params.narrator_role} (${params.narrator_name})
      - NGÁCH: ${params.content_niche}
      - THỜI LƯỢNG: ${params.duration}s (~${minutes.toFixed(2)} phút)
      - MỤC TIÊU KÝ TỰ TỔNG: ${targetChars} [${minChars}-${maxChars}]
      - NGÔN NGỮ & VĂN HÓA: ${params.language} / ${params.culture}
      
      YÊU CẦU NGHIÊM NGẶT VỀ CẤU TRÚC:
      1. PHẢI TẠO ĐÚNG CHÍNH XÁC ${params.sceneCount} PHÂN CẢNH.
      2. Tối ưu hóa tông giọng để phản ánh chính xác bản sắc thương hiệu.
      3. Phân bổ thời lượng hợp lý.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.75,
      },
    });

    try {
      const data = JSON.parse(response.text || "{}");
      return data;
    } catch (e) {
      throw new Error("Lỗi sản xuất kịch bản.");
    }
  }

  async generateVisualPrompts(script: DocumentaryScript, visualStyle: string, negativePrompt?: string): Promise<VisualAsset[]> {
    const prompt = `
      KHỞI TẠO VISUAL PROMPTS NHẤT QUÁN (CONSISTENCY ENGINE):
      - Style chủ đạo: ${visualStyle}
      - Loại trừ thêm: ${negativePrompt || 'N/A'}
      
      QUY TRÌNH THỰC HIỆN:
      BƯỚC 1: Phân tích toàn bộ ${script.scenes.length} phân cảnh để xác định "Chủ thể Visual chính" (Ví dụ: Một tế bào bạch cầu cụ thể, một nhân vật anime nam tóc đen, hoặc một mô hình lỗ đen nhất quán).
      BƯỚC 2: Thiết lập một "Bộ quy tắc thị giác" (Visual Bible) cho dự án này bao gồm: Bảng màu, chất liệu, và đặc điểm nhận dạng của chủ thể.
      BƯỚC 3: Tạo prompt cho từng cảnh dựa trên Visual Bible đã thiết lập. Đảm bảo mọi cảnh đều cảm thấy như thuộc về cùng một bộ phim.

      YÊU CẦU:
      1. Nếu là phong cách anime/manga: Phải mô tả nhất quán kiểu tóc, trang phục, và nét vẽ.
      2. Nếu là phong cách y khoa (Lee Biz): Phải mô tả nhất quán cấu trúc tế bào/cơ quan bằng tiếng Việt.
      3. Mọi prompt hình ảnh (whisk_image_prompt) phải bắt đầu bằng việc khẳng định lại Visual Style chủ đạo trước khi mô tả chi tiết cảnh.

      DANH SÁCH CẢNH CẦN TẠO PROMPT:
      ${script.scenes.map(s => `CẢNH ${s.id} (Lời bình): "${s.narration}"`).join("\n\n")}
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                visual_prompts: { type: Type.ARRAY, items: VISUAL_ASSET_SCHEMA }
            },
            required: ["visual_prompts"]
        },
      },
    });

    try {
      const data = JSON.parse(response.text || "{}");
      return data.visual_prompts || [];
    } catch (e) {
      throw new Error("Lỗi Visual AI. Không thể tạo prompt hình ảnh.");
    }
  }

  async fixScene(script: DocumentaryScript, sceneId: number, feedback: string): Promise<DocumentaryScript> {
    const scene = script.scenes.find(s => s.id === sceneId);
    const duration = scene?.duration_seconds || 60;
    const isAsianLang = /ja|ko|zh/i.test(script.project_spec.target.language);
    const targetChars = isAsianLang ? (duration / 60) * 380 : (duration / 60) * 150 * 5.8;

    const prompt = `HIỆU CHỈNH CẢNH ${sceneId} THEO YÊU CẦU: ${feedback}. 
    Mục tiêu ký tự: ${Math.floor(targetChars)} cho ${duration} giây. Duy trì bản sắc thương hiệu.`;
    
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: SCENE_SCHEMA,
      },
    });

    try {
      const updatedScene = JSON.parse(response.text || "{}");
      const updatedScript = { ...script };
      updatedScript.scenes = updatedScript.scenes.map(s => s.id === sceneId ? updatedScene : s);
      return updatedScript;
    } catch (e) {
      throw new Error("Lỗi khi hiệu chỉnh phân cảnh.");
    }
  }
}
