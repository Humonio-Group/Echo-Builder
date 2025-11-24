export default defineNuxtRouteMiddleware(async () => {
  const store = useCompanyStore();
  if (store.isLoaded) return;

  await store.loadBranding();
});
