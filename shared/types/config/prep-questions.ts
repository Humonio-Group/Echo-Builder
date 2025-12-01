import type { TNull, Translations } from "#shared/types/primitives";

export const EPrepQuestionTypes = ["short", "long", "select", "range"] as const;
export type PrepQuestionType = (typeof EPrepQuestionTypes)[number];

export interface TextQuestionConfig {
  maxLength: number;
}
export interface SelectQuestionConfig {
  options: Translations[];
}
export interface RangeQuestionConfig {
  min: number;
  max: number;
}

export type PrepQuestionConfig = TextQuestionConfig
  | SelectQuestionConfig
  | RangeQuestionConfig
;

export interface PrepQuestion {
  key?: TNull<string>;
  order: number;
  label: Translations;
  type: PrepQuestionType;
  required: boolean;
  config: PrepQuestionConfig;
}
export interface PrepQuestionText extends PrepQuestion {
  type: "short" | "long";
  config: TextQuestionConfig;
}
export interface PrepQuestionSelect extends PrepQuestion {
  type: "select";
  config: SelectQuestionConfig;
}
export interface PrepQuestionRange extends PrepQuestion {
  type: "range";
  config: RangeQuestionConfig;
}
export type PrepQuestions = PrepQuestion[];
