import type { UserState } from "#shared/types/stores/user";

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
  }),
  getters: {
    authenticated: state => !!state.user,
  },
  actions: {
    async loadUser() {
      try {
        const user = await $fetch(useApi2Url("/users/me", "v1"), {
          ...useFetchOptions(),
        });
        if (!user) return;
        this.user = user;
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
