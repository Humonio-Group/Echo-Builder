import type { ID, TNull, Translations } from "../primitives";
import type { PrepQuestions } from "~~/shared/types/config/prep-questions";
import type { Evaluations } from "~~/shared/types/config/evaluations";
import type { ElevenLabsModel, Voice } from "~~/shared/types/elevenlabs";
import type { Replica } from "~~/shared/types/tavus";

export interface BuilderState {
  contentId: ID;
  attributes: {
    name: Translations;
    description: Translations;
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
      };
      video: {
        replica: string;
      };
      end: {
        user: boolean;
        time: boolean;
        duration: number;
        agent: boolean;
      };
    };
  };
  voices: TNull<Voice[]>;
  replicas: TNull<Replica[]>;
  loading: {
    voices: boolean;
    replicas: boolean;
  };
  languages: string[];
  touched: boolean;
}
