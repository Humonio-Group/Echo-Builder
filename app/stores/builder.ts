import type { BuilderState } from "~~/shared/types/stores/builder";
import { toast } from "vue-sonner";
import type {
  EvaluationType, GraphEvaluationConfig,
  GraphEvaluationPreviewMode,
  ParagraphEvaluationConfig,
  ScoreEvaluationConfig,
} from "#shared/types/config/evaluations";
import type {
  PrepQuestionType,
  RangeQuestionConfig,
  SelectQuestionConfig,
  TextQuestionConfig,
} from "#shared/types/config/prep-questions";

export const useBuilderStore = defineStore("builder", {
  state: (): BuilderState => ({
    contentId: -1,
    attributes: {
      name: "Sinsim",
      description: "Sinsim description",
      questions: [],
      evaluations: [],
      modes: {
        text: true,
        audio: false,
        video: false,
      },
      config: {
        systemPrompt: "",
        model: "gpt-4o-mini",
        audio: {
          model: "elevenlabs_multilingual_v2",
          voice: "rony",
        },
        video: {
          replica: "ashley",
        },
        end: {
          user: true,
          time: false,
          duration: 10,
          agent: false,
        },
      },
    },
    touched: false,
  }),
  getters: {
    isLoaded: state => typeof state.contentId === "string" || state.contentId >= 0,
    isInvalid: (state) => {
      const validName = !!state.attributes.name.trim().length;
      const validDescription = !!state.attributes.description.trim().length;
      const hasMode = Object.values(state.attributes.modes).some(v => !!v);
      const validSystemPrompt = state.attributes.config.systemPrompt.trim().length > 200;
      const questionsValid = state.attributes.questions.every((q) => {
        const global = !!q.label.trim().length;

        switch (q.type) {
          case "short": case "long": {
            return global && (q.config as TextQuestionConfig).maxLength;
          }
          case "select": {
            return global && (q.config as SelectQuestionConfig).options.length >= 2;
          }
          case "range": {
            return global && (q.config as RangeQuestionConfig).min <= (q.config as RangeQuestionConfig).max;
          }
        }
      });
      const evaluationsValid = state.attributes.evaluations.every((evaluation) => {
        const global = evaluation.method.trim().length >= 100;

        switch (evaluation.type) {
          case "score": {
            const config = evaluation.config as ScoreEvaluationConfig;
            return global && config.min <= config.max;
          }
          case "graph": {
            const config = evaluation.config as GraphEvaluationConfig;
            return global && config.min <= config.max && config.axes.length >= 2;
          }
          default: {
            const config = evaluation.config as ParagraphEvaluationConfig;
            return global && config.writingMethod.trim().length >= 100;
          }
        }
      });

      return !state.touched
        || !validName
        || !validDescription
        || !hasMode
        || !validSystemPrompt
        || !questionsValid
        || !evaluationsValid
      ;
    },
    hasMainScore: state => state.attributes.evaluations.some(e => e.type === "score" && (e.config as ScoreEvaluationConfig).mainScore),
  },
  actions: {
    async loadSimulation(id: number) {
      this.contentId = id;
      // TODO: load simulation from API
    },

    addQuestion(type: PrepQuestionType) {
      let config;
      switch (type) {
        case "short": {
          config = {
            maxLength: 255,
          };
          break;
        }
        case "long": {
          config = {
            maxLength: 2048,
          };
          break;
        }
        case "select": {
          config = {
            options: ["Option 1", "Option 2"],
          };
          break;
        }
        case "range": {
          config = {
            min: 0,
            max: 10,
          };
          break;
        }
      }

      this.attributes.questions.push({
        order: -1,
        label: useNuxtApp().$i18n.t("labels.question-placeholder"),
        type,
        required: false,
        config,
      });
      this.updateQuestionsOrder();
    },
    removeQuestion(order: number) {
      this.attributes.questions = this.attributes.questions.filter(q => q.order !== order);
      this.updateQuestionsOrder();
    },
    orderQuestion(order: number, direction: "up" | "down") {
      switch (direction) {
        case "up": {
          break;
        }
        case "down": {
          break;
        }
      }

      this.updateQuestionsOrder();
    },
    updateQuestionsOrder() {
      this.attributes.questions = this.attributes.questions.map((q, index) => ({ ...q, order: index }));
    },

    addEvaluation(type: EvaluationType, previewMode?: GraphEvaluationPreviewMode) {
      const { t } = useNuxtApp().$i18n;

      let config;
      switch (type) {
        case "score": {
          config = {
            mainScore: false,
            previewMode: "text",
            min: 0,
            max: 100,
          };
          break;
        }
        case "graph": {
          if (!previewMode) previewMode = "bar";
          config = {
            previewMode,
            min: 0,
            max: 100,
            axes: [`${t("labels.axis")} 1`, `${t("labels.axis")} 2`],
          };
          break;
        }
        default: {
          config = {
            writingMethod: "",
          };
          break;
        }
      }

      this.attributes.evaluations.push({
        order: this.attributes.evaluations.length + 1,
        type,
        method: "",
        config,
      });
      this.updateEvaluationsOrder();
    },
    removeEvaluation(index: number) {
      this.attributes.evaluations = this.attributes.evaluations.filter(e => e.order !== index);
      this.updateEvaluationsOrder();
    },
    updateEvaluationsOrder() {
      this.attributes.evaluations = this.attributes.evaluations.map((e, index) => ({ ...e, order: index }));
    },
    makeMainScore(order: number) {
      const update = (value: boolean) => this.attributes.evaluations = this.attributes.evaluations.map((e) => {
        if (e.type !== "score") return e;
        if (e.order !== order) return {
          ...e,
          config: {
            ...e.config as ScoreEvaluationConfig,
            mainScore: false,
          },
        };
        return {
          ...e,
          config: {
            ...e.config as ScoreEvaluationConfig,
            mainScore: value,
          },
        };
      });

      const element = this.attributes.evaluations.find(e => e.order === order);
      if (element!.type !== "score") return;
      update(!(element!.config as ScoreEvaluationConfig).mainScore);
    },

    touch() {
      this.touched = true;
    },
    save(close?: boolean) {
      const { t } = useNuxtApp().$i18n;

      const content = {
        id: this.contentId,
        attributes: {
          name: this.attributes.name,
          description: this.attributes.description,
          questions: this.attributes.questions,
          modes: this.attributes.modes,
        },
      };

      const save = (retry: boolean = true) => toast.promise(new Promise((resolve, reject) => setTimeout(() => {
        console.log(content);

        const random = Math.floor(Math.random() * 2);
        if (random === 0) {
          this.touched = false;
          if (close) useWindowContext().close();
          resolve(content);
        }
        else reject(new Error("Failed to save"));
      }, 1500)), {
        loading: t("labels.toasts.saving-changes.loading"),
        success: () => t("labels.toasts.saving-changes.success"),
        error: () => retry
          ? {
              message: t("labels.toasts.saving-changes.error"),
              action: {
                label: t("btn.retry"),
                onClick: () => {
                  save();
                },
              },
            }
          : t("labels.toasts.saving-changes.error"),
      });
      save();
    },
    export(version: "1.2" | "2004") {
      const { t } = useNuxtApp().$i18n;

      const exportScorm = (retry: boolean = true) => toast.promise(new Promise((resolve, reject) => setTimeout(() => {
        console.log(version);

        const random = Math.floor(Math.random() * 2);
        if (random === 0) resolve(version);
        else reject(new Error("Failed to save"));
      }, 1500)), {
        loading: t("labels.toasts.exporting-scorm.loading", { version }),
        success: () => t("labels.toasts.exporting-scorm.success", { version }),
        error: () => retry
          ? {
              message: t("labels.toasts.exporting-scorm.error"),
              action: {
                label: t("btn.retry"),
                onClick: () => {
                  exportScorm(false);
                },
              },
            }
          : t("labels.toasts.exporting-scorm.error"),
      });
      exportScorm();
    },
  },
});
