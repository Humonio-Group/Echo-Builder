import type { CompanyState } from "~~/shared/types/stores/company";
import type { CompanyBrandingMeta } from "~~/shared/types/company";

export const useCompanyStore = defineStore("company", {
  state: (): CompanyState => ({
    name: null,
    icon: null,
    logo: null,
    colors: null,
  }),
  getters: {
    isLoaded: state => !!state.name || !!state.icon || !!state.logo || !!state.colors,
  },
  actions: {
    async loadBranding() {
      try {
        const branding = await $fetch<CompanyBrandingMeta>(useApi2Url("/branding", "v1"), {
          headers: useHeaders(),
          query: useParams(),
        });

        this.name = branding.meta.company;
        this.icon = branding.meta.icon;
        this.logo = branding.meta.logo;
        this.colors = {
          first: branding.meta.colors.firstGradient,
          second: branding.meta.colors.secondGradient,
        };
      }
      catch {
        console.error("Failed to load branding");
      }
    },
  },
});
