import type { ID, TNull, Translations } from "../primitives";
import type { PrepQuestions } from "~~/shared/types/config/prep-questions";
import type { Evaluations } from "~~/shared/types/config/evaluations";
import type { ElevenLabsModel, Voice } from "~~/shared/types/elevenlabs";
import type { Replica } from "~~/shared/types/tavus";

export interface BuilderState {
  contentId: ID;
  programId: ID;
  attributes: {
    name: Translations;
    description: Translations;
    avatar: TNull<string>;
    questions: PrepQuestions;
    evaluations: Evaluations;
    modes: {
      text: boolean;
      audio: boolean;
      video: boolean;
    };
    config: {
      systemPrompt: string;
      model: string;
      temperature: number;
      audio: {
        model: ElevenLabsModel;
        voice: string;
        speed: number; // turbo, multilingual
        stability: number; // turbo, multilingual, v3
        similarity: number; // turbo, multilingual
        exageration: number; // multilingual
      };
      video: {
        replica: string;
        enhance: boolean;
      };
      end: {
        user: boolean;
        time: boolean;
        duration: number;
        agent: boolean;
        instructions: string;
      };
    };
  };
  voices: TNull<Voice[]>;
  replicas: TNull<Replica[]>;
  loading: {
    voices: boolean;
    replicas: boolean;
    avatar: boolean;
  };
  languages: string[];
  touched: boolean;
}
