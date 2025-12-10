import type { UserState } from "#shared/types/stores/user";

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
  }),
  getters: {
    authenticated: state => !!state.user,
    hasText: state => !!state.user!.ai.activePlans.text?.length,
    hasAudio: state => !!state.user!.ai.activePlans.audio?.length,
    hasVideo: state => !!state.user!.ai.activePlans.video?.length,
  },
  actions: {
    async loadUser() {
      try {
        // eslint-disable-next-line
        const response = await $fetch<any>(useApi2Url("/users/me", "v1"), {
          ...useFetchOptions({
            params: {
              "include": "company",
              "fields[companies]": "ai",
            },
          }),
        });

        if (!response) return;

        this.user = {
          id: response.data.id,
          ...response.data.attributes,
          ai: response.included!.find(i => i.type === "companies")!.attributes.ai,
        };
      }
      catch (e) {
        const error = e as FetchError;

        switch (error.statusCode) {
          case 401: {
            // navigateTo(useRuntimeConfig().public.auth, { external: true });
            return;
          }
        }
      }
    },
  },
});
