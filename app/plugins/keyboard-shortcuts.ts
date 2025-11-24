import { toast } from "vue-sonner";

export default defineNuxtPlugin(() => {
  const { registerMultiple } = useKeyboardShortcuts();
  const store = useBuilderStore();
  const { t } = useNuxtApp().$i18n;

  const saveHandler = () => {
    const { touched, isInvalid } = storeToRefs(store);

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
      }
    });

    if (!touched.value) return;

    if (isInvalid.value) {
      toast.warning(t("labels.toasts.fix-errors-before-saving"));
      return;
    }

    store.save();
  };
  registerMultiple("save", [
    {
      key: "Meta+S",
      description: "Save (Mac)",
      once: true,
      handler: saveHandler,
    },
    {
      key: "Ctrl+S",
      description: "Save (Windows/Linux)",
      once: true,
      handler: saveHandler,
    },
  ]);
  const exportHandler = () => {
    if (storeToRefs(store).touched.value) {
      toast.warning(t("labels.toasts.save-changes-before-exporting"));
      return;
    }

    store.export("1.2");
  };
  registerMultiple("export", [
    {
      key: "Meta+E",
      description: "Export (Mac)",
      once: true,
      handler: exportHandler,
    },
    {
      key: "Ctrl+E",
      description: "Export (Windows/Linux)",
      once: true,
      handler: exportHandler,
    },
  ]);

  return {
    provide: {
      shortcuts: useKeyboardShortcuts(),
    },
  };
});
