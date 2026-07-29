
export interface LanguagePack {
  voice_rules: string[];
  tone_preferences: string[];
  taboos_and_sensitivities: string[];
  honorifics_or_politeness: string;
  idioms_or_slang_examples: string[];
  anti_translationese_rules: string[];
  subtitle_rule: string;
  format_rule_for_multilingual_lines: string;
}

export interface TopicPack {
  domain: string;
  narrative_rules: string[];
  must_include: string[];
  must_avoid: string[];
  evidence_style: "data_light" | "data_heavy" | "narrative_only";
  pacing_bias: "slow" | "balanced" | "fast";
  visual_bias: string[];
}

export interface Shot {
  description: string;
  duration_seconds: number;
  camera_angle: string;
  lighting?: string;
  motion?: string;
}

export interface VisualAsset {
  scene_id: number;
  whisk_image_prompt: string;
  veo3_video_prompt: string;
  aesthetic_tags: string[];
  shot_type: string;
  camera_angle: string;
  lighting_style: string;
  recommended_image_count: number;
}

export interface Scene {
  id: number;
  structure_step: string;
  time_range: string;
  duration_seconds: number;
  narration: string;
  visual_prompt: string;
  cultural_context: string;
  narrative_beat?: string;
  shots?: Shot[];
  visual_assets?: VisualAsset;
}

export interface ProjectSpec {
  topic: {
    domain: string;
    title: string;
    angle: string;
    audience_level: string;
    safety_level: string;
  };
  target: { 
    country: string; 
    language: string; 
    duration_seconds: number; 
    total_scenes: number; 
    fixed_scene_duration_seconds: number; 
  };
  identity: {
    narrator_role: string;
    content_niche: string;
    channel_name: string;
    narrator_name: string;
  };
}

export interface DocumentaryScript {
  title: string;
  project_spec: ProjectSpec;
  language_pack: LanguagePack;
  topic_pack: TopicPack;
  style_notes: string;
  scenes: Scene[];
}

export interface ScriptRequest {
  topic: string;
  language: string;
  culture: string;
  duration: number;
  sceneCount: number;
  script_style?: string;
  visual_style?: string;
  negative_prompt?: string;
  // Identity Fields
  narrator_role: string;
  content_niche: string;
  channel_name: string;
  narrator_name: string;
}
