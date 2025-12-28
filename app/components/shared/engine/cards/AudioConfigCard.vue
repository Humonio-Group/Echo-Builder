<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import VoiceModelSelection from "~/components/shared/engine/audio/VoiceModelSelection.vue";
import VoiceSelectionCard from "~/components/shared/engine/audio/VoiceSelectionCard.vue";
import SpeedControl from "~/components/shared/engine/audio/SpeedControl.vue";
import StabilityControl from "~/components/shared/engine/audio/StabilityControl.vue";
import SimilarityControl from "~/components/shared/engine/audio/SimilarityControl.vue";
import ExagerationControl from "~/components/shared/engine/audio/ExagerationControl.vue";

const store = useBuilderStore();
const { attributes } = storeToRefs(store);
</script>

<template>
  <Card class="gap-4">
    <CardHeader class="grid-rows-1!">
      <CardTitle
        class="flex items-center gap-2"
        :class="{ 'text-destructive': store.invalidVoice }"
      >
        {{ $t("pages.engine.audio.title") }}

        <Tooltip v-if="store.invalidVoice">
          <TooltipTrigger>
            <AlertCircle class="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ $t("labels.tooltips.has-error") }}</p>
          </TooltipContent>
        </Tooltip>
      </CardTitle>
    </CardHeader>

    <CardContent class="grid gap-4">
      <VoiceModelSelection />

      <VoiceSelectionCard />

      <SpeedControl v-if="attributes.config.audio.model !== 'eleven_v3'" />
      <StabilityControl />
      <SimilarityControl v-if="attributes.config.audio.model !== 'eleven_v3'" />
      <ExagerationControl v-if="attributes.config.audio.model === 'eleven_multilingual_v2'" />
    </CardContent>
  </Card>
</template>
