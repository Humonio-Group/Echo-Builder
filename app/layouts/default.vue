<script setup lang="ts">
import Layout from "~/components/primitives/composing/Layout.vue";
import TopBar from "~/components/shared/top-bar/TopBar.vue";

const { t } = useI18n();

const route = useRoute();
const nameKey = computed(() => route.meta.nameKey as string | undefined);

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);

useHead({
  title: `${attributes.value.name}${nameKey.value ? `· ${t(nameKey.value)}` : ""}`,
});
</script>

<template>
  <Layout class="flex flex-col gap-4 min-h-dvh p-6 pt-0">
    <TopBar />

    <div class="flex-1">
      <NuxtPage />
    </div>
  </Layout>
</template>
