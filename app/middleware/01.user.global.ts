export default defineNuxtRouteMiddleware(async () => {
  const store = useUserStore();
  if (store.authenticated) return;

  await store.loadUser();
});
