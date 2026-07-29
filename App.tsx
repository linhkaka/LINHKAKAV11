
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { DocumentaryScript, ScriptRequest, Scene, VisualAsset } from './types';
import { 
  Play, Settings, FileText, Globe, Clock, Layers, Sparkles, Download, 
  RefreshCcw, MessageSquare, AlertCircle, Monitor, BookOpen, Map, 
  Brain, Info, ChevronRight, Activity, Camera, Sun, Maximize, Video, Image as ImageIcon,
  CheckCircle2, Eye, Layout, ChevronDown, Hash, Navigation, MousePointer2, Timer, ListChecks,
  FileDown, FileAudio, FileVideo, FileCode, Flag, Palette, Edit3, XCircle, Wand2, Zap, Facebook, Plus, X, Search, Check, Save, Trash2, RotateCcw,
  UserCircle2, Target, Radio, HeartPulse, Stethoscope, Microscope, Activity as ActivityIcon,
  Lightbulb, TrendingUp, FlaskConical, HelpCircle
} from 'lucide-react';

const gemini = new GeminiService();

const NARRATOR_ROLES = [
  { id: 'doctor', label: 'Bác sĩ chuyên khoa', desc: 'Chuyên nghiệp, tin cậy, dựa trên y học lâm sàng và nghiên cứu.' },
  { id: 'health_expert', label: 'Chuyên gia sức khỏe', desc: 'Kiến thức sâu rộng về lối sống, dinh dưỡng và sức khỏe tinh thần.' },
  { id: 'research_lead', label: 'Trưởng nhóm nghiên cứu', desc: 'Tư duy logic, dựa trên dữ liệu thực nghiệm và quy trình khoa học khắt khe.' },
  { id: 'behavioral_economist', label: 'Nhà kinh tế học hành vi', desc: 'Khám phá tâm lý học đằng sau các quyết định kinh tế và thói quen tiêu dùng.' },
  { id: 'ai_ethicist', label: 'Chuyên gia đạo đức AI', desc: 'Phân tích ranh giới giữa công nghệ và nhân tính trong kỷ nguyên trí tuệ nhân tạo.' },
  { id: 'sociologist', label: 'Nhà xã hội học', desc: 'Quan sát và lý giải các hiện tượng xã hội, cấu trúc cộng đồng và biến đổi văn hóa.' },
  { id: 'science_communicator', label: 'Người truyền thông khoa học', desc: 'Nhiệt huyết, dễ hiểu, kết nối kiến thức hàn lâm với đời sống thường nhật.' },
  { id: 'curiosity_expert', label: 'Chuyên gia giải đáp tò mò', desc: 'Năng động, cuốn hút, biến những câu hỏi "Tại sao" thành hành trình khám phá.' },
  { id: 'financial_advisor', label: 'Cố vấn tài chính', desc: 'Thực tế, chi tiết, tập trung vào quản trị rủi ro và tối ưu hóa tài sản.' },
  { id: 'investor_pro', label: 'Nhà đầu tư chuyên nghiệp', desc: 'Chia sẻ kinh nghiệm thực chiến, tư duy thị trường và quản trị danh mục.' },
  { id: 'traditional_healer', label: 'Lương y / Thầy thuốc', desc: 'Am hiểu sâu sắc về y học cổ truyền, thảo dược và trị liệu tự nhiên.' },
  { id: 'strategic_analyst', label: 'Nhà phân tích chiến lược', desc: 'Sắc bén, khách quan, phân tích địa chính trị và chiến lược quân sự.' },
  { id: 'investigative_journalist', label: 'Nhà báo điều tra', desc: 'Tập trung vào sự thật, bằng chứng và lật tẩy các góc khuất.' },
  { id: 'historian', label: 'Sử gia - Người kể chuyện', desc: 'Trang trọng, sâu sắc, kết nối các sự kiện lịch sử với hiện tại.' },
  { id: 'military_historian', label: 'Sử gia quân sự', desc: 'Am hiểu về khí tài, chiến thuật và tâm lý chiến trong các cuộc xung đột.' },
  { id: 'geopolitical_expert', label: 'Chuyên gia địa chính trị', desc: 'Tầm nhìn rộng về quan hệ quốc tế và bản đồ quyền lực toàn cầu.' },
  { id: 'macroeconomist', label: 'Nhà kinh tế vĩ mô', desc: 'Logic, dựa trên số liệu phân tích thị trường và tài chính.' },
  { id: 'science_philosopher', label: 'Triết gia khoa học', desc: 'Kết nối giữa tri thức thực nghiệm và những câu hỏi hiện sinh về vũ trụ.' },
  { id: 'tech_evangelist', label: 'Nhà truyền bá công nghệ', desc: 'Tầm nhìn tương lai, tập trung vào sự thay đổi xã hội dưới tác động của Tech.' },
  { id: 'documentary_neutral', label: 'Người dẫn chuyện trung lập', desc: 'Tông giọng chuẩn mực, khách quan như National Geographic.' },
  { id: 'explainer_mass', label: 'Người kể chuyện đại chúng', desc: 'Dễ hiểu, sinh động, biến kiến thức phức tạp thành đơn giản.' },
];

const CONTENT_NICHES = [
  { id: 'health_medical', label: 'Sức khỏe & Y tế', desc: 'Kiến thức y khoa, đột phá y học, chăm sóc sức khỏe và wellness.' },
  { id: 'scientific_research', label: 'Nghiên cứu khoa học', desc: 'Đột phá phòng thí nghiệm, phương pháp nghiên cứu và công bố quốc tế.' },
  { id: 'popular_science', label: 'Khoa học phổ thông', desc: 'Vật lý, thiên văn, sinh học ứng dụng cho mọi lứa tuổi.' },
  { id: 'curiosity_why_not', label: 'Giải đáp thắc mắc (Why Not?)', desc: 'Khám phá những hiện tượng lạ, câu hỏi hóc búa và bí ẩn đời thường.' },
  { id: 'personal_finance', label: 'Tài chính cá nhân & Đầu tư', desc: 'Quản lý tiền bạc, tư duy làm giàu và thị trường tài chính.' },
  { id: 'global_geopolitics', label: 'Địa chính trị toàn cầu', desc: 'Cạnh tranh cường quốc, quan hệ ngoại giao và xung đột.' },
  { id: 'regional_politics', label: 'Chính trị Khu vực', desc: 'Phân tích sâu về nội chính của các quốc gia/khu vực cụ thể.' },
  { id: 'macro_finance', label: 'Kinh tế - Tài chính vĩ mô', desc: 'Thị trường tài chính, lạm phát và dòng chảy tiền tệ.' },
  { id: 'military_history', label: 'Lịch sử quân sự', desc: 'Các cuộc chiến, chiến thuật và khí tài quân sự qua các thời kỳ.' },
  { id: 'tech_ai_semiconductor', label: 'Công nghệ - Bán dẫn - AI', desc: 'Cuộc đua công nghệ lõi và tương lai nhân loại.' },
  { id: 'power_investigation', label: 'Điều tra quyền lực', desc: 'Hậu trường chính trị và các tổ chức quyền lực ngầm.' },
  { id: 'national_crisis', label: 'Khủng hoảng quốc gia', desc: 'Sụp đổ kinh tế, biến động xã hội và bất ổn dân sự.' },
  { id: 'resources_energy', label: 'Năng lượng & Tài nguyên', desc: 'Dầu mỏ, đất hiếm và an ninh năng lượng toàn cầu.' },
];

const LANGUAGES = [
  "Afrikaans (af)", "Albanian (sq)", "Amharic (am)", "Arabic (ar-SA)", "Armenian (hy)", "Azerbaijani (az)", "Basque (eu)", "Belarusian (be)", "Bengali (bn)", "Bosnian (bs)", "Bulgarian (bg)", "Catalan (ca)", "Cebuano (ceb)", "Chinese Simplified (zh-CN)", "Chinese Traditional (zh-TW)", "Corsican (co)", "Croatian (hr)", "Czech (cs)", "Danish (da)", "Dutch (nl)", "English (en-US)", "English (en-GB)", "Esperanto (eo)", "Estonian (et)", "Finnish (fi)", "French (fr-FR)", "Frisian (fy)", "Galician (gl)", "Georgian (ka)", "German (de-DE)", "Greek (el)", "Gujarati (gu)", "Haitian Creole (ht)", "Hausa (ha)", "Hawaiian (haw)", "Hebrew (he)", "Hindi (hi-IN)", "Hmong (hmn)", "Hungarian (hu)", "Icelandic (is)", "Igbo (ig)", "Indonesian (id-ID)", "Irish (ga)", "Italian (it-IT)", "Japanese (ja-JP)", "Javanese (jw)", "Kannada (kn)", "Kazakh (kk)", "Khmer (km)", "Korean (ko-KR)", "Kurdish (ku)", "Kyrgyz (ky)", "Lao (lo)", "Latin (la)", "Latvian (lv)", "Lithuanian (lt)", "Luxembourgish (lb)", "Macedonian (mk)", "Malagasy (mg)", "Malay (ms)", "Malayalam (ml)", "Maltese (mt)", "Maori (mi)", "Marathi (mr)", "Mongolian (mn)", "Myanmar (my)", "Nepali (ne)", "Norwegian (no)", "Nyanja (ny)", "Pashto (ps)", "Persian (fa)", "Polish (pl)", "Portuguese (pt-PT)", "Portuguese (pt-BR)", "Punjabi (pa)", "Romanian (ro)", "Russian (ru-RU)", "Samoan (sm)", "Scots Gaelic (gd)", "Serbian (sr)", "Sesotho (st)", "Shona (sn)", "Sindhi (sd)", "Sinhala (si)", "Slovak (sk)", "Slovenian (sl)", "Somali (so)", "Spanish (es-ES)", "Sundanese (su)", "Swahili (sw)", "Swedish (sv-SE)", "Tagalog (tl)", "Tajik (tg)", "Tamil (ta)", "Telugu (te)", "Thai (th-TH)", "Turkish (tr-TR)", "Ukrainian (uk)", "Urdu (ur)", "Uzbek (uz)", "Vietnamese (vi-VN)", "Welsh (cy)", "Xhosa (xh)", "Yiddish (yi)", "Yoruba (yo)", "Zulu (zu)"
].sort();

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenian", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

const SCRIPT_STYLES = [
  { id: 'chinh_luan', label: 'Chính luận & Sắc bén', desc: 'Phù hợp cho phân tích địa chính trị, chiến lược, lịch sử.' },
  { id: 'y_khoa_tin_cay', label: 'Y khoa & Tin cậy', desc: 'Dùng cho sức khỏe, giải thích khoa học một cách nghiêm túc.' },
  { id: 'hai_huoc', label: 'Hài hước & Dí dỏm', desc: 'Lời thoại vui nhộn, thông minh, tạo tiếng cười nhẹ nhàng.' },
  { id: 'cham_biem', label: 'Châm biếm & Sâu cay', desc: 'Mỉa mai, ẩn dụ, dùng để phê phán hoặc lật tẩy vấn đề.' },
  { id: 'nghe_thuat', label: 'Nghệ thuật & Thơ mộng', desc: 'Văn phong giàu hình ảnh, dùng cho văn hóa, thiên nhiên.' },
  { id: 'kich_tinh', label: 'Kịch tính & Hồi hộp', desc: 'Nhịp độ nhanh, lôi cuốn, phù hợp cho điều tra, phá án.' },
];

const VISUAL_STYLE_PRESETS = [
  { id: 'medical_3d', label: 'Y khoa 3D Render', desc: 'Professional 3D medical visualization, Unreal Engine 5, anatomical accuracy, clean lighting, subsurface scattering' },
  { id: 'stickman', label: 'Người que (Stickman)', desc: 'Minimalist stickman animation, expressive lines, simple background, energetic movement, informative and humorous' },
  { id: 'japanese_anime', label: 'Anime Nhật Bản', desc: 'High-quality Japanese anime style, vibrant colors, expressive eyes, dynamic line art, modern Shonen aesthetic' },
  { id: 'ghibli', label: 'Phong cách Ghibli', desc: 'Studio Ghibli aesthetic, hand-painted watercolor textures, lush nature, whimsical atmosphere, nostalgic feel' },
  { id: 'korean_manhwa', label: 'Truyện tranh Hàn Quốc', desc: 'Modern Korean manhwa style, sleek characters, vibrant digital coloring, cinematic panel composition' },
  { id: 'marvel_comic', label: 'Marvel Comic Style', desc: 'Classic Marvel comic book art, bold inks, dramatic shadows, superhero anatomy, dynamic action scenes' },
  { id: 'manga', label: 'Truyện tranh Manga', desc: 'Classic black and white manga style, screen tones, speed lines, expressive character emotions, detailed background ink work' },
  { id: 'microscopic', label: 'Vi hiển vi (Microscopic)', desc: 'Electron microscope style, macro photography, cellular detail, scientific depth, slight chromatic aberration' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Cinematic lighting, Hollywood look, high contrast, anamorphic lens flares' },
  { id: 'modern_bg', label: 'Nền hiện đại', desc: 'Modern colorful vibrant background, motion graphics style' },
  { id: 'isometric', label: 'Isometric 3D', desc: 'Isometric 3D view, clean render, toy-like miniature aesthetic' },
  { id: 'watercolor', label: 'Màu nước', desc: 'Soft watercolor texture, hand-painted look' },
  { id: 'pixel_art', label: 'Pixel Art', desc: '8-bit retro gaming style' },
  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon lights, futuristic city, rainy streets' },
  { id: 'minimalist', label: 'Tối giản', desc: 'Minimalist flat design, clean lines' },
  { id: 'realistic', label: 'Chân thực', desc: 'Photorealistic 8k detail, life-like textures' },
];

const NEGATIVE_PRESET_TAGS = [
  'low quality', 'blurry', 'text', 'watermark', 'distorted faces', 'deformed hands', 'extra limbs', 'grainy', 'out of frame'
];

const DURATIONS = [
  { label: '5 - 10 phút', value: 600 },
  { label: '10 - 20 phút', value: 1200 },
  { label: '20 - 30 phút', value: 1800 },
  { label: '30 - 45 phút', value: 2700 },
  { label: '45 - 60 phút', value: 3600 },
  { label: '60 - 90 phút', value: 5400 },
  { label: '90 - 120 phút', value: 7200 },
];

const SCENE_COUNTS = [5, 10, 15, 20, 30, 40, 50, 60, 80, 100, 120, 150];

const INITIAL_FORM_DATA: ScriptRequest = {
  topic: 'Khám phá bí ẩn của lỗ đen và tác động của chúng đối với thời gian và không gian.',
  language: 'Vietnamese (vi-VN)',
  culture: 'Vietnam',
  duration: 600,
  sceneCount: 15,
  script_style: 'y_khoa_tin_cay',
  visual_style: 'medical_3d',
  negative_prompt: '',
  narrator_role: 'science_communicator',
  content_niche: 'popular_science',
  channel_name: 'Linhkaka Science Studio',
  narrator_name: 'Prof. Linh'
};

const SearchableSelect: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
  placeholder?: string;
}> = ({ label, icon, options, value, onChange, accentColor, placeholder = "Tìm kiếm..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className={`text-[9px] font-bold uppercase tracking-widest px-1 flex items-center gap-2 text-slate-500`}>
        {icon} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all text-xs"
      >
        <span className={value ? "text-slate-200" : "text-slate-600"}>{value || "Chọn..."}</span>
        <ChevronDown size={14} className={`text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[70] mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <Search size={12} className="text-slate-500" />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-xs text-slate-300 w-full placeholder:text-slate-700"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-slate-600 text-[10px] uppercase font-bold">Không tìm thấy</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt}
                  onClick={(e) => { e.stopPropagation(); onChange(opt); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between hover:bg-slate-800 ${value === opt ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-slate-400'}`}
                >
                  {opt}
                  {value === opt && <Check size={12} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MultiSelectDropdown: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: { id: string; label: string; desc?: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  accentColor: string;
  placeholder?: string;
}> = ({ label, icon, options, selectedIds, onToggle, accentColor, placeholder = "Tìm kiếm..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    (opt.desc && opt.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className={`text-[10px] font-black uppercase tracking-widest px-1 flex items-center gap-2 ${accentColor}`}>
        {icon} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
      >
        <div className="flex flex-wrap gap-1.5 max-w-[90%]">
          {selectedIds.length === 0 ? (
            <span className="text-slate-600 text-xs">Chọn mục...</span>
          ) : (
            selectedIds.map(id => (
              <span key={id} className={`px-2 py-0.5 rounded-md text-[9px] font-bold text-white ${accentColor.replace('text-', 'bg-').replace('/80', '')}`}>
                {options.find(o => o.id === id)?.label || id}
              </span>
            ))
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[60] mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <Search size={14} className="text-slate-500" />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-xs text-slate-300 w-full placeholder:text-slate-700"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-slate-600 text-[10px] uppercase font-bold">Không tìm thấy</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt.id}
                  onClick={(e) => { e.stopPropagation(); onToggle(opt.id); }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white flex items-center gap-2">
                      {opt.label}
                    </span>
                    {opt.desc && <span className="text-[9px] text-slate-600">{opt.desc}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIds.includes(opt.id) && (
                      <Check size={14} className={accentColor} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<DocumentaryScript | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'strategy' | 'visuals' | 'preview'>('script');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const [userStyles] = useState<{ id: string; label: string; desc: string }[]>(() => {
    const saved = localStorage.getItem('linhkaka_user_styles');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['medical_3d', 'cinematic']);
  const [customStyleInput, setCustomStyleInput] = useState('');
  const [selectedNegativeTags, setSelectedNegativeTags] = useState<string[]>(['text', 'watermark', 'low quality']);
  const [customNegativeInput, setCustomNegativeInput] = useState('');

  const [formData, setFormData] = useState<ScriptRequest>(INITIAL_FORM_DATA);

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleNegativeTag = (tag: string) => {
    setSelectedNegativeTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
  };

  const getCombinedVisualStyle = () => {
    const combinedPresets = [...VISUAL_STYLE_PRESETS, ...userStyles];
    const presets = selectedStyles.map(id => combinedPresets.find(p => p.id === id)?.desc).filter(Boolean);
    if (customStyleInput) presets.push(customStyleInput);
    return presets.join(', ');
  };

  const getCombinedNegativePrompt = () => {
    const tags = [...selectedNegativeTags];
    if (customNegativeInput) tags.push(customNegativeInput);
    return tags.join(', ');
  };

  const handleReset = () => {
    if (script && !window.confirm("BẠN CÓ CHẮC CHẮN MUỐN TẠO MỚI? Toàn bộ dữ liệu hiện tại sẽ bị xóa sạch.")) return;
    setScript(null);
    setFormData(INITIAL_FORM_DATA);
    setSelectedStyles(['medical_3d', 'cinematic']);
    setSelectedNegativeTags(['text', 'watermark', 'low quality']);
    setError(null);
    setActiveTab('script');
  };

  const generateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const visualStyle = getCombinedVisualStyle();
      const negPrompt = getCombinedNegativePrompt();
      
      const result = await gemini.generateScript({ 
        ...formData, 
        visual_style: visualStyle,
        negative_prompt: negPrompt
      });
      setScript(result);
      setActiveTab('script');
    } catch (err: any) {
      setError(err.message || "Không thể tạo kịch bản.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!script) return;
    setPromptLoading(true);
    setError(null);
    try {
      const visualStyle = getCombinedVisualStyle();
      const negPrompt = getCombinedNegativePrompt();
      const assets = await gemini.generateVisualPrompts(script, visualStyle, negPrompt);
      const updatedScript = { ...script };
      updatedScript.scenes = updatedScript.scenes.map(s => {
        const asset = assets.find(a => a.scene_id === s.id);
        return asset ? { ...s, visual_assets: asset } : s;
      });
      setScript(updatedScript);
      setActiveTab('visuals');
    } catch (err: any) {
      setError("Lỗi Visual AI: " + err.message);
    } finally {
      setPromptLoading(false);
    }
  };

  const handleFixScene = async (sceneId: number, feedback: string) => {
    if (!script) return;
    setLoading(true);
    try {
      const updated = await gemini.fixScene(script, sceneId, feedback);
      setScript(updated);
    } catch (err: any) {
      setError("Lỗi hiệu chỉnh: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (type: 'voice' | 'whisk' | 'veo3' | 'full') => {
    if (!script) return;
    let content = "";
    let filename = `Linhkaka_Docu_${script.title.replace(/\s+/g, '_')}`;
    const visual = getCombinedVisualStyle();

    switch (type) {
      case 'voice':
        content = script.scenes.map(s => `[Cảnh ${s.id}] (${s.time_range})\n${s.narration}\n`).join('\n');
        filename += "_VoiceScript.txt";
        break;
      case 'whisk':
        content = script.scenes.map(s => `Scene ${s.id} [Shot: ${s.visual_assets?.shot_type || 'N/A'}, Angle: ${s.visual_assets?.camera_angle || 'N/A'}]:\n${s.visual_assets?.whisk_image_prompt || 'N/A'}\n`).join('\n');
        filename += "_WhiskPrompts.txt";
        break;
      case 'veo3':
        content = script.scenes.map(s => `Scene ${s.id} [Visual Style: ${visual}]:\n${s.visual_assets?.veo3_video_prompt || 'N/A'}\n`).join('\n');
        filename += "_Veo3Prompts.txt";
        break;
      case 'full':
        content = `TITLE: ${script.title}\nBRAND: ${script.project_spec.identity.channel_name}\nPERSONA: ${script.project_spec.identity.narrator_role}\nNICHE: ${script.project_spec.identity.content_niche}\n\n`;
        content += script.scenes.map(s => (
          `------------------------------\n` +
          `CẢNH ${s.id} | ${s.time_range}\n` +
          `SHOT: ${s.visual_assets?.shot_type || 'N/A'} | ANGLE: ${s.visual_assets?.camera_angle || 'N/A'} | LIGHTING: ${s.visual_assets?.lighting_style || 'N/A'}\n` +
          `VOICE: ${s.narration}\n` +
          `WHISK: ${s.visual_assets?.whisk_image_prompt || 'N/A'}\n` +
          `VEO3: ${s.visual_assets?.veo3_video_prompt || 'N/A'}\n`
        )).join('\n');
        filename += "_FullProject.txt";
        break;
    }
    const element = document.createElement('a');
    element.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Monitor className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight uppercase tracking-tighter text-white">Linhkaka v11</h1>
              <a href="https://www.facebook.com/linhkaka1989" target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1 hover:text-indigo-300 transition-colors">
                <Facebook size={10} /> by linhkaka
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[10px] font-black transition-all border border-slate-700 uppercase tracking-widest active:scale-95">
                <RotateCcw size={14} /> Tạo mới
              </button>
            {script && (
              <button onClick={handleGeneratePrompts} disabled={promptLoading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-xs font-black transition-all shadow-lg active:scale-95 disabled:bg-slate-800">
                {promptLoading ? <RefreshCcw className="animate-spin" size={14} /> : <Zap size={14} />}
                {promptLoading ? "AI RENDERING..." : "VISUAL AI ENGINE"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg"><Layout className="text-indigo-400" size={18} /></div>
              <h2 className="font-bold text-slate-200 uppercase text-xs tracking-widest">Thiết lập sản xuất</h2>
            </div>
            
            <form onSubmit={generateScript} className="space-y-6">
              <div className="space-y-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle2 className="text-indigo-400" size={14} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Định danh thương hiệu</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tên Kênh</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-700" value={formData.channel_name} onChange={e => setFormData({...formData, channel_name: e.target.value})} placeholder="VD: Linhkaka Studio" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Người dẫn</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-700" value={formData.narrator_name} onChange={e => setFormData({...formData, narrator_name: e.target.value})} placeholder="VD: Prof. Linh" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vai trò Narrator</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.narrator_role} onChange={e => setFormData({...formData, narrator_role: e.target.value})}>
                    {NARRATOR_ROLES.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                  </select>
                  {formData.narrator_role && <p className="text-[10px] text-slate-500 italic mt-1 leading-tight">{NARRATOR_ROLES.find(r => r.id === formData.narrator_role)?.desc}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ngách nội dung</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.content_niche} onChange={e => setFormData({...formData, content_niche: e.target.value})}>
                    {CONTENT_NICHES.map(niche => <option key={niche.id} value={niche.id}>{niche.label}</option>)}
                  </select>
                  {formData.content_niche && <p className="text-[10px] text-slate-500 italic mt-1 leading-tight">{CONTENT_NICHES.find(n => n.id === formData.content_niche)?.desc}</p>}
                </div>
              </div>

              <div className="space-y-4 p-4 bg-slate-950/50 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="text-emerald-400" size={14} />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Bản địa hóa (Localization)</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <SearchableSelect 
                    label="Ngôn ngữ đích" 
                    icon={<Check size={10} />} 
                    options={LANGUAGES} 
                    value={formData.language} 
                    onChange={val => setFormData({...formData, language: val})} 
                    accentColor="text-emerald-400" 
                    placeholder="Tìm ngôn ngữ..."
                  />
                  <SearchableSelect 
                    label="Quốc gia/Văn hóa" 
                    icon={<Map size={10} />} 
                    options={COUNTRIES} 
                    value={formData.culture} 
                    onChange={val => setFormData({...formData, culture: val})} 
                    accentColor="text-emerald-400" 
                    placeholder="Tìm quốc gia..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Chủ đề phim</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none font-medium custom-scrollbar" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Số phân cảnh</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold" value={formData.sceneCount} onChange={(e) => setFormData({...formData, sceneCount: parseInt(e.target.value)})}>
                    {SCENE_COUNTS.map(count => <option key={count} value={count}>{count} Cảnh</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Thời lượng tổng</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}>
                    {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Phong cách Kịch bản</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold" value={formData.script_style} onChange={(e) => setFormData({...formData, script_style: e.target.value})}>
                  {SCRIPT_STYLES.map(style => <option key={style.id} value={style.id}>{style.label}</option>)}
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <MultiSelectDropdown label="Phong cách hình ảnh" icon={<Palette size={14} />} options={[...VISUAL_STYLE_PRESETS, ...userStyles]} selectedIds={selectedStyles} onToggle={toggleStyle} accentColor="text-indigo-400" />
                <div className="relative">
                  < Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tùy chỉnh prompt hình ảnh..." value={customStyleInput} onChange={(e) => setCustomStyleInput(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <MultiSelectDropdown label="Vùng loại trừ (Negative)" icon={<XCircle size={14} />} options={NEGATIVE_PRESET_TAGS.map(t => ({ id: t, label: t }))} selectedIds={selectedNegativeTags} onToggle={toggleNegativeTag} accentColor="text-amber-500/80" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest mt-2">
                {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Play size={18} />}
                {loading ? "ĐANG XỬ LÝ..." : "TẠO KỊCH BẢN THƯƠNG HIỆU"}
              </button>
            </form>
          </section>
        </aside>

        <div className="lg:col-span-8 space-y-8">
          {!script && !loading && (
            <div className="h-[750px] border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-900/10">
              <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                <BookOpen className="text-indigo-500/50 relative z-10" size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-300 mb-4 tracking-tighter uppercase">Linhkaka v11 Studio</h3>
              <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed mb-8">Hệ thống biên kịch tài liệu trường đoạn chuyên nghiệp. Kết hợp bản sắc thương hiệu, chuyên môn y tế, tài chính, khoa học phổ thông và bản địa hóa toàn cầu.</p>
              <div className="grid grid-cols-6 gap-6 opacity-30">
                <div className="flex flex-col items-center gap-2 text-rose-500"><HeartPulse size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Health</span></div>
                <div className="flex flex-col items-center gap-2 text-indigo-400"><FlaskConical size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Research</span></div>
                <div className="flex flex-col items-center gap-2 text-amber-500"><TrendingUp size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Finance</span></div>
                <div className="flex flex-col items-center gap-2 text-emerald-500"><Lightbulb size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Science</span></div>
                <div className="flex flex-col items-center gap-2 text-blue-500"><HelpCircle size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Why Not</span></div>
                <div className="flex flex-col items-center gap-2 text-purple-500"><Radio size={20} /><span className="text-[7px] font-black uppercase tracking-widest">Media</span></div>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-[750px] bg-slate-900/20 rounded-[3rem] flex flex-col items-center justify-center space-y-8">
               <div className="w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
               <div className="text-center px-8">
                 <h4 className="text-xl font-black italic serif text-slate-300 uppercase tracking-tight">Đang tổng hợp kịch bản bản sắc {formData.channel_name}...</h4>
                 <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 px-2 py-0.5 rounded-full">{formData.language}</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">|</span>
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 px-2 py-0.5 rounded-full">{formData.culture}</span>
                 </div>
               </div>
            </div>
          )}

          {script && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20">
              <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit sticky top-20 z-40 backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('script')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'script' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}><FileText size={14} /> Kịch bản</button>
                <button onClick={() => setActiveTab('preview')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}><Eye size={14} /> Xem nhanh</button>
                <button onClick={() => setActiveTab('visuals')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'visuals' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}><Camera size={14} /> Visual AI</button>
                <button onClick={() => setActiveTab('strategy')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'strategy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}><Brain size={14} /> Chiến lược</button>
              </div>

              {activeTab === 'script' && (
                <div className="space-y-12">
                   <div className="space-y-3 border-l-4 border-indigo-500 pl-8 py-2">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-white serif uppercase">{script.title}</h2>
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{script.project_spec.identity.channel_name}</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{NARRATOR_ROLES.find(r => r.id === script.project_spec.identity.narrator_role)?.label}</span>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">{CONTENT_NICHES.find(n => n.id === script.project_spec.identity.content_niche)?.label}</span>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{script.project_spec.target.country}</span>
                      </div>
                   </div>
                   <div className="space-y-8">
                      {script.scenes.map(scene => <SceneCard key={scene.id} scene={scene} onFix={(f) => handleFixScene(scene.id, f)} />)}
                   </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[800px]">
                  <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
                    <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2 text-white"><Eye className="text-indigo-400" size={20} /> Production View</h3>
                    <div className="relative">
                      <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all active:scale-95"><Download size={14} /> Xuất dữ liệu</button>
                      {showDownloadMenu && (
                        <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                          <button onClick={() => handleDownload('voice')} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest"><FileAudio size={16} className="text-indigo-400" /> Lời bình (VO)</button>
                          <button onClick={() => handleDownload('whisk')} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest"><ImageIcon size={16} className="text-blue-400" /> Whisk Image Prompts</button>
                          <button onClick={() => handleDownload('veo3')} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest"><FileVideo size={16} className="text-emerald-400" /> Veo3 Video Prompts</button>
                          <button onClick={() => handleDownload('full')} className="w-full text-left px-4 py-3 text-[10px] font-black text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest border-t border-slate-800"><FileDown size={16} /> Full Production Kit</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar bg-slate-950/30">
                    {script.scenes.map(scene => (
                      <div key={scene.id} className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800/30 pb-20 mb-20 relative">
                        <div className="md:col-span-2 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-3xl tabular-nums text-slate-800">{scene.id}</div>
                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">{scene.duration_seconds}s</div>
                        </div>
                        <div className="md:col-span-10 space-y-4">
                          <div className="flex gap-4">
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">{scene.structure_step}</span>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{scene.time_range}</span>
                          </div>
                          <p className="text-2xl serif italic text-slate-200 leading-relaxed font-medium">&ldquo;{scene.narration}&rdquo;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'visuals' && (
                <div className="space-y-8">
                  {script.scenes.some(s => s.visual_assets) ? (
                    script.scenes.filter(s => s.visual_assets).map(scene => (
                      <VisualAssetCard key={scene.id} sceneId={scene.id} asset={scene.visual_assets! as any} duration={scene.duration_seconds} visualStyle={getCombinedVisualStyle()} negativePrompt={getCombinedNegativePrompt()} />
                    ))
                  ) : (
                    <div className="h-72 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20">
                      <Sparkles className="text-indigo-500/50 mb-4" size={32} />
                      <button onClick={handleGeneratePrompts} className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest transition-all shadow-2xl active:scale-95">KHỞI CHẠY VISUAL ENGINE</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'strategy' && (
                <div className="grid md:grid-cols-2 gap-8 pb-20">
                   <StrategyBlock title="Tối ưu hóa Ngôn ngữ" rules={script.language_pack.anti_translationese_rules} icon={<Globe size={20} />} />
                   <StrategyBlock title="Chiến lược Kể chuyện" rules={script.topic_pack.narrative_rules} icon={<Brain size={20} />} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const SceneCard: React.FC<{ scene: Scene; onFix: (f: string) => void }> = ({ scene, onFix }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/40 transition-all shadow-xl">
    <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
       <div className="flex items-center gap-6">
          <span className="text-4xl font-black text-slate-800 tabular-nums">{scene.id.toString().padStart(2, '0')}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded-md border border-indigo-500/20 uppercase tracking-widest">{scene.structure_step}</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{scene.duration_seconds}s | {scene.time_range}</span>
            </div>
          </div>
       </div>
       <button onClick={() => { const f = prompt("Yêu cầu hiệu chỉnh cho cảnh này:"); if(f) onFix(f); }} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-500 transition-all border border-slate-700"><Edit3 size={16} /></button>
    </div>
    <div className="p-8 grid md:grid-cols-5 gap-10">
       <div className="md:col-span-3 space-y-4 border-r border-slate-800/50 pr-8">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2"><MessageSquare size={12} /> Lời bình</div>
          <p className="text-lg serif italic text-slate-200 leading-relaxed font-medium">&ldquo;{scene.narration}&rdquo;</p>
       </div>
       <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2"><Camera size={12} /> Visual Prompt</div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 italic h-36 overflow-y-auto leading-relaxed custom-scrollbar">{scene.visual_prompt}</div>
       </div>
    </div>
  </div>
);

const VisualAssetCard: React.FC<{ sceneId: number; asset: VisualAsset; duration: number; visualStyle: string; negativePrompt: string }> = ({ sceneId, asset, duration, visualStyle, negativePrompt }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl border-l-4 border-l-indigo-500">
    <div className="flex items-center justify-between border-b border-slate-800 pb-6">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center font-black text-indigo-400">{sceneId}</div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Gen-AI Production Toolkit</h4>
            <div className="flex gap-4 mt-1.5">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Camera size={10} className="text-indigo-400"/> {asset.shot_type} | {asset.camera_angle}</span>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 ml-4"><Sun size={10} className="text-amber-400"/> {asset.lighting_style}</span>
            </div>
          </div>
       </div>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
       <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest"><ImageIcon size={14} /> Whisk (Image)</div></div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl font-mono text-[10px] text-slate-400 leading-relaxed h-44 overflow-y-auto custom-scrollbar">
             <div className="mb-2 text-indigo-500/50"># Positive</div> {asset.whisk_image_prompt}
             {negativePrompt && <div className="mt-4 pt-4 border-t border-slate-800/50"><div className="mb-2 text-amber-500/50"># Negative</div> {negativePrompt}</div>}
          </div>
       </div>
       <div className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest"><Video size={14} /> Veo3 (Video)</div></div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl font-mono text-[10px] text-slate-400 leading-relaxed h-44 overflow-y-auto custom-scrollbar">{asset.veo3_video_prompt}</div>
       </div>
    </div>
  </div>
);

const StrategyBlock: React.FC<{ title: string; rules: string[]; icon: React.ReactNode }> = ({ title, rules, icon }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-xl h-full border-t-2 border-t-slate-700">
    <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
       <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">{icon}</div>
       <h3 className="font-black uppercase tracking-tight text-white">{title}</h3>
    </div>
    <ul className="space-y-4">
       {rules.map((r, i) => (
         <li key={i} className="flex items-start gap-4 text-xs text-slate-400 font-medium leading-relaxed group">
           <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
           {r}
         </li>
       ))}
    </ul>
  </div>
);

export default App;
