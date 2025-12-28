export const useApi1Url = (path: string, version: string) => `${useRuntimeConfig().public.api["1"]}/${version}/${path.startsWith("/") ? path.substring(1) : path}`;
export const useApi2Url = (path: string, version: string) => `${useRuntimeConfig().public.api["2"]}/${version}/${path.startsWith("/") ? path.substring(1) : path}`;

export const useHeaders = (headers?: { [key: string]: string }) => {
  const { public: config } = useRuntimeConfig();

  return {
    "X-PLATFORM": config.platform,
    ...headers,
  };
};
export const useParams = (params?: { [key: string]: string }) => {
  const { public: config } = useRuntimeConfig();

  return {
    key: config.api.key,
    ...params,
  };
};
export const useFetchOptions = (options?: {
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
  params?: { [key: string]: string };
}) => ({
  headers: useHeaders(options?.headers),
  query: useParams(options?.query),
  params: options?.params,
  credentials: "include",
});
