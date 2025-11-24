export default defineNuxtRouteMiddleware(async (to) => {
  const simulationId = to.params.simulationId;

  if (!simulationId) return;

  const store = useBuilderStore();
  await store.loadSimulation(parseInt(simulationId as string));
});
