import type { ID } from "../primitives";

export interface BuilderState {
  contentId: ID;
  attributes: {
    name: string;
    description: string;
    questions: {
      order: number;
      value: string;
    }[];
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
