export const ELEVENLABS_MODELS = ["eleven_turbo_v2_5", "eleven_multilingual_v2", "eleven_v3"] as const;
export type ElevenLabsModel = typeof ELEVENLABS_MODELS[number];

export interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  preview_url: string;
}
