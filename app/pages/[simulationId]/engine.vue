<script setup lang="ts">
import Page from "~/components/primitives/composing/Page.vue";
import OutputModesCard from "~/components/shared/engine/cards/OutputModesCard.vue";
import SystemPromptCard from "~/components/shared/engine/cards/SystemPromptCard.vue";
import AudioConfigCard from "~/components/shared/engine/cards/AudioConfigCard.vue";
import VideoConfigCard from "~/components/shared/engine/cards/VideoConfigCard.vue";

definePageMeta({
  nameKey: "navigation.engine",
});

const userStore = useUserStore();
const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <Page
    name="engine"
    class="flex justify-center"
  >
    <div class="w-full max-w-3xl gap-6 flex flex-col py-6">
      <header>
        <h1 class="text-2xl font-black">
          {{ $t("pages.engine.title") }}
        </h1>
        <p class="text-muted-foreground">
          {{ $t("pages.engine.description") }}
        </p>
      </header>

      <SystemPromptCard />

      <AudioConfigCard v-if="(attributes.modes.audio || attributes.modes.video) && userStore.hasAudio" />

      <VideoConfigCard v-if="attributes.modes.video && userStore.hasVideo" />

      <OutputModesCard />
    </div>
  </Page>
</template>
