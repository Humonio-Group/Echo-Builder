import type { TNull, Translations } from "#shared/types/primitives";

export const EEvaluationTypes = [
  "score",
  "graph",
  "paragraph",
] as const;
export const EScoreEvaluationPreviewMode = [
  "text",
  "gauge",
] as const;
export const EGraphEvaluationPreviewMode = [
  "bar",
  "spider",
  "line",
];

export type EvaluationType = (typeof EEvaluationTypes)[number];
export type ScoreEvaluationPreviewMode = (typeof EScoreEvaluationPreviewMode)[number];
export type GraphEvaluationPreviewMode = (typeof EGraphEvaluationPreviewMode)[number];

export type EvaluationConfig = ScoreEvaluationConfig | GraphEvaluationConfig | ParagraphEvaluationConfig;
export interface Evaluation {
  order: number;
  key?: TNull<string>;
  type: EvaluationType;
  method: string;
  config: EvaluationConfig;
}

export interface ScoreEvaluationConfig {
  mainScore: boolean;
  previewMode: ScoreEvaluationPreviewMode;
  min: number;
  max: number;
}
export interface ScoreEvaluation extends Evaluation {
  type: "score";
  config: ScoreEvaluationConfig;
}

export interface GraphEvaluationConfig {
  previewMode: GraphEvaluationPreviewMode;
  min: number;
  max: number;
  axes: Translations[];
}
export interface GraphEvaluation extends Evaluation {
  type: "graph";
  config: GraphEvaluationConfig;
}

export interface ParagraphEvaluationConfig {
  writingMethod: string;
}
export interface ParagraphEvaluation extends Evaluation {
  type: "paragraph";
  config: ParagraphEvaluationConfig;
}

export type Evaluations = Evaluation[];
