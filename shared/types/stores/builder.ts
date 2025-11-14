import type { ID } from "../primitives";
import type { PrepQuestions } from "~~/shared/types/config/prep-questions";
import type { Evaluations } from "~~/shared/types/config/evaluations";

export interface BuilderState {
  contentId: ID;
  attributes: {
    name: string;
    description: string;
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
