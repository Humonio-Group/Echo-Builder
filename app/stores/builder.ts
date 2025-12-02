import type { BuilderState } from "~~/shared/types/stores/builder";
import { toast } from "vue-sonner";
import type {
  EvaluationConfig,
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

const defaultTranslations = (codes: string[]): Translations => {
  const translations: Translations = {};
  codes.forEach(code => translations[code] = "");
  return translations;
};

export const useBuilderStore = defineStore("builder", {
  state: (): BuilderState => ({
    contentId: -1,
    attributes: {
      name: {},
      description: {},
      questions: [],
      evaluations: [],
      modes: {
        text: true,
        audio: false,
        video: false,
      },
      config: {
        systemPrompt: "",
        model: "",
        audio: {
          model: "",
          voice: "",
        },
        video: {
          replica: "",
        },
        end: {
          user: true,
          time: false,
          duration: 10,
          agent: false,
        },
      },
    },
    voices: null,
    replicas: null,
    loading: {
      voices: false,
      replicas: false,
    },
    languages: [],
    touched: false,
  }),
  getters: {
    isLoaded: state => typeof state.contentId === "string" || state.contentId >= 0,
    isTouched: state => state.touched,

    isInvalid() {
      return !this.isTouched
        || this.invalidTranslations.length > 0
        || this.invalidMode
        || this.invalidSystemPrompt
        || this.invalidQuestions
        || this.invalidEvaluations
      ;
    },
    invalidTranslations: (state) => {
      const langs = [];

      for (const lang of state.languages) {
        const validName = !!state.attributes.name[lang]!.trim().length;
        const validDescription = !!state.attributes.description[lang]!.trim().length;
        const validQuestions = state.attributes.questions.every((question) => {
          const validLabel = question.label[lang]!.trim().length;
          const validOptions = question.type !== "select" || question.config.options[lang]!.trim();

          return validLabel && validOptions;
        });
        const validEvaluations = state.attributes.evaluations.filter(e => e.type === "graph").every((evaluation) => {
          const config = evaluation.config as GraphEvaluationConfig;
          return config.axes.every(a => a[lang]!.trim().length);
        });

        if (!validName || !validDescription || !validQuestions || !validEvaluations) langs.push(lang);
      }

      return langs;
    },
    invalidMode: state => !Object.values(state.attributes.modes).some(v => !!v),
    invalidSystemPrompt: state => state.attributes.config.systemPrompt.trim().length < 200,
    invalidQuestions: state => !state.attributes.questions.every((q) => {
      const global = Object.values(!!q.label).every(v => v.trim().length);

      switch (q.type) {
        case "short": case "long": {
          return global && (q.config as TextQuestionConfig).maxLength;
        }
        case "select": {
          return global && (q.config as SelectQuestionConfig).options.length >= 2 && (q.config as SelectQuestionConfig).options.every(o => Object.values(o).every(v => v.trim().length));
        }
        case "range": {
          return global && (q.config as RangeQuestionConfig).min <= (q.config as RangeQuestionConfig).max;
        }
      }
    }),
    invalidEvaluations: state => !state.attributes.evaluations.every((evaluation) => {
      const global = evaluation.method.trim().length >= 100;

      switch (evaluation.type) {
        case "score": {
          const config = evaluation.config as ScoreEvaluationConfig;
          return global && config.min <= config.max;
        }
        case "graph": {
          const config = evaluation.config as GraphEvaluationConfig;
          return global && config.min <= config.max && config.axes.length >= 2 && config.axes.every(a => Object.values(a).every(v => v.trim().length));
        }
        default: {
          const config = evaluation.config as ParagraphEvaluationConfig;
          return global && config.writingMethod.trim().length >= 100;
        }
      }
    }),

    hasMainScore: state => state.attributes.evaluations.some(e => e.type === "score" && (e.config as ScoreEvaluationConfig).mainScore),
    hasFirstLoadedVoices: state => state.voices !== null,
    hasFirstLoadedReplicas: state => state.replicas !== null,
    selectedVoice: state => state.attributes.config.audio.voice ? state.voices?.find(v => v.id === state.attributes.config.audio.voice) : null,
    selectedReplica: state => state.attributes.config.video.replica ? state.replicas?.find(v => v.id === state.attributes.config.video.replica) : null,
  },
  actions: {
    async loadVoices() {
      this.loading.voices = true;

      try {
        const voices = await $fetch(useApi2Url("/echo_simulations/elevenlabs/voices", "v2"), { ...useFetchOptions() });
        if (!voices) return;
        this.voices = voices.data;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.voices = false;
      }
    },
    async loadReplicas() {
      this.loading.replicas = true;

      try {
        const replicas = await $fetch(useApi2Url("/echo_simulations/tavus/replicas", "v2"), { ...useFetchOptions() });
        if (!replicas) return;
        this.replicas = replicas.data;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.replicas = false;
      }
    },
    async loadSimulation(id: number) {
      try {
        const response = await $fetch<unknown>(useApi2Url(`/echo_simulations/${id}/specimen`, "v2"), {
          ...useFetchOptions({
            params: {
              include: "questions,evaluations,program,program.languages",
            },
          }),
        });

        if (!response) return;

        await this.storeSimulation(response);
      }
      catch (e) {
        const error = e as FetchError;

        console.log(error);

        switch (error.statusCode) {
          case 401: {
            // navigateTo(useRuntimeConfig().public.auth, { external: true });
            return;
          }
        }
      }
    },

    async storeSimulation(response: unknown) {
      const { data: simulation, included } = response;
      const languages = included.filter(i => i.type === "languages");
      const questions = included.filter(i => i.type === "echoSimulationQuestions");
      const evaluations = included.filter(i => i.type === "echoSimulationEvaluations");

      this.languages = languages.map(l => ({
        code: l.attributes.code,
      })).reduce((acc, val) => {
        acc = [
          ...acc,
          val.code,
        ];

        return acc;
      }, []);

      this.contentId = simulation.id;
      this.attributes.name = {
        ...defaultTranslations(this.languages),
        ...simulation.attributes.name,
      };
      this.attributes.description = {
        ...defaultTranslations(this.languages),
        ...simulation.attributes.description,
      };
      this.attributes.modes = simulation.attributes.modes;
      this.attributes.config = {
        ...this.attributes.config,
        systemPrompt: simulation.attributes.engine.system_prompt || "",
        model: simulation.attributes.engine.model ?? "gpt-4o-mini",
        audio: {
          model: "elevenlabs_multilingual_v2",
          voice: simulation.attributes.engine.audio?.voice ?? "",
        },
        video: {
          replica: simulation.attributes.engine.tavus?.default_replica_id ?? "",
        },
        end: {
          time: simulation.attributes.engine.end_modes.byTime.enabled,
          duration: simulation.attributes.engine.end_modes.byTime.duration,
          agent: simulation.attributes.engine.end_modes.byAI,
          user: simulation.attributes.engine.end_modes.byUser,
        },
      };
      this.attributes.questions = questions.map(q => ({
        key: q.attributes.key,
        order: q.attributes.order,
        label: {
          ...defaultTranslations(this.languages),
          ...q.attributes.label,
        },
        type: q.attributes.type,
        required: q.attributes.required,
        config: {
          ...q.attributes.config,
          ...(q.attributes.config.options
            ? { options: q.attributes.config.options.map(o => ({
                ...defaultTranslations(this.languages),
                ...o,
              })) }
            : {}),
        },
      }));
      this.attributes.evaluations = evaluations.map(e => ({
        key: e.attributes.key,
        order: e.attributes.order,
        type: e.attributes.type,
        method: e.attributes.method ?? "",
        config: {
          ...e.attributes.config,
          ...(e.attributes.config.axes
            ? { axes: e.attributes.config.axes.map(a => ({
                ...defaultTranslations(this.languages),
                ...a,
              })) }
            : {}),
        },
      }));

      await new Promise(resolve => setTimeout(resolve, 10));
      this.touched = false;
    },
    buildSimulationBody() {
      const name = this.attributes.name;
      const description = this.attributes.description;
      const modes = this.attributes.modes;
      const status = "active";

      const audioConfig = this.attributes.modes.audio
        ? {
            audio: {
              voice: this.attributes.config.audio.voice,
            },
          }
        : {};
      const videoConfig = this.attributes.modes.video
        ? {
            tavus: {
              default_replica_id: this.attributes.config.video.replica,
            },
          }
        : {};
      const end_modes = {
        byUser: this.attributes.config.end.user,
        byTime: {
          enabled: this.attributes.config.end.time,
          duration: this.attributes.config.end.duration,
        },
        byAI: this.attributes.config.end.agent,
      };
      const engine = {
        system_prompt: this.attributes.config.systemPrompt,
        temperature: 0.5,
        ...audioConfig,
        ...videoConfig,
        end_modes,
      };

      const questions = this.attributes.questions;
      const evaluations = this.attributes.evaluations;

      return {
        name,
        description,
        modes,
        status,
        engine,
        // Relations
        questions,
        evaluations,
      };
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
            options: [
              this.languages.reduce((acc, val) => {
                acc[val] = "Option 1";
                return acc;
              }, {} as Translations),
              this.languages.reduce((acc, val) => {
                acc[val] = "Option 2";
                return acc;
              }, {} as Translations),
            ],
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
        label: {
          ...this.languages.map(l => ({ [l]: useNuxtApp().$i18n.t("labels.question-placeholder") })).reduce((acc, val) => {
            acc = {
              ...acc,
              ...val,
            };

            return acc;
          }),
        },
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

      let config: EvaluationConfig;
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
            axes: [{
              ...this.languages.map(l => ({ [l]: t("labels.axis-placeholder") })).reduce((acc, val) => {
                acc = {
                  ...acc,
                  ...val,
                };

                return acc;
              }, {}),
            }],
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
      const t = useNuxtApp().$i18n.t;

      const save = (retry: boolean = true) => toast.promise($fetch(useApi2Url(`/echo_simulations/${this.contentId}/save`, "v2"), {
        method: "PUT",
        ...useFetchOptions({
          params: {
            include: "questions,evaluations,program,program.languages",
          },
        }),
        body: this.buildSimulationBody(),
      }), {
        loading: t("labels.toasts.saving-changes.loading"),
        success: async (data: unknown) => {
          await this.storeSimulation(data);

          if (close) useWindowContext().close();
          return t("labels.toasts.saving-changes.success");
        },
        error: () => retry
          ? {
              message: t("labels.toasts.saving-changes.error"),
              action: {
                label: t("btn.retry"),
                onClick: save(false),
              },
            }
          : t("labels.toasts.saving-changes.error"),
      });
      save();
    },
    export(version: "1.2" | "2004") {
      const { t } = useNuxtApp().$i18n;

      const exportScorm = (retry: boolean = true) => toast.promise($fetch(useApi2Url(`/echo_simulations/${this.contentId}/export-scorm`, "v2"), { ...useFetchOptions() }), {
        loading: t("labels.toasts.exporting-scorm.loading", { version }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        success: (response: any) => {
          window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
          return t("labels.toasts.exporting-scorm.success", { version });
        },
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
