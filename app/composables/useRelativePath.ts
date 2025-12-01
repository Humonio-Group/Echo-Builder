export const useRelativePath = (path: string): TNull<string> => {
  const builder = useBuilderStore();
  const { contentId } = storeToRefs(builder);

  if (!contentId.value || (contentId.value as number) <= 0) return null;

  return useLocalePath()(`/${contentId.value}/${path.startsWith("/") ? path.substring(1) : path}`);
};
