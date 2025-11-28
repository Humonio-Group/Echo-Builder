export const useTranslation = (translations: Translations) => {
  const locale = useNuxtApp().$i18n.locale;

  return translations[locale.value];
};
