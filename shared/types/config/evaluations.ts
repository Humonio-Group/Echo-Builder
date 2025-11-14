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

export interface Evaluation {
  order: number;
  type: EvaluationType;
  method: string;
  config: unknown;
}

export interface ScoreEvaluationConfig {
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
  axes: string[];
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
