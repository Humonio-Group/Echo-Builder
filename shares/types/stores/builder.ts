import type { ID } from "../primitives";
import type { PrepQuestions } from "~~/shares/types/config/prep-questions";

export interface BuilderState {
  contentId: ID;
  attributes: {
    name: string;
    description: string;
    questions: PrepQuestions;
    evaluations: string[];
    modes: {
      text: boolean;
      audio: boolean;
      video: boolean;
    };
    config: {
      systemPrompt: string;
      model: string;
      audio: {
        model: string;
        voice: string;
      };
      video: {
        replica: string;
      };
    };
  };
  touched: boolean;
}
