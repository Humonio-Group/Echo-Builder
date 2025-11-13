import type { BuilderState } from "~~/shares/types/stores/builder";
import { toast } from "vue-sonner";

export const useBuilderStore = defineStore("builder", {
  state: (): BuilderState => ({
    contentId: -1,
    attributes: {
      name: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquam commodi distinctio facilis labore, rem. Alias enim magnam modi mollitia quibusdam reprehenderit sit voluptatem?",
      questions: [
        {
          order: 1,
          value: "Question 1",
        },
        {
          order: 2,
          value: "Question 2",
        },
        {
          order: 3,
          value: "Question 3",
        },
      ],
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
          voice: "rebecca",
        },
        video: {
          replica: "john",
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
      const validQuestions = state.attributes.questions.every(q => !!q.value.trim().length);
      const hasMode = !!Object.entries(state.attributes.modes).filter(([, value]) => !!value).length;
      const validSystemPrompt = state.attributes.config.systemPrompt.trim().length > 200;

      return !state.touched
        || !validName
        || !validDescription
        || !validQuestions
        || !hasMode
        || !validSystemPrompt
      ;
    },
  },
  actions: {
    moveUp(index: number) {
      if (index <= 0) return;

      const temp = this.attributes.questions[index];
      this.attributes.questions[index] = this.attributes.questions[index - 1]!;
      this.attributes.questions[index - 1] = temp!;
      this.updateOrder();
    },
    moveDown(index: number) {
      if (index >= this.attributes.questions.length - 1) return;

      const temp = this.attributes.questions[index];
      this.attributes.questions[index] = this.attributes.questions[index + 1]!;
      this.attributes.questions[index + 1] = temp!;
      this.updateOrder();
    },
    addQuestion() {
      this.attributes.questions = [...this.attributes.questions, {
        order: this.attributes.questions.length + 1,
        value: `Question ${this.attributes.questions.length + 1}`,
      }];
      this.updateOrder();
    },
    removeQuestion(index: number) {
      this.attributes.questions = this.attributes.questions.filter(q => q.order !== index);
      this.updateOrder();
    },
    updateOrder() {
      this.attributes.questions = this.attributes.questions.map((question, index) => ({ ...question, order: index + 1 }));
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
