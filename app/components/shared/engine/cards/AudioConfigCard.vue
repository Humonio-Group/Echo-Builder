<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import VoiceModelSelection from "~/components/shared/engine/audio/VoiceModelSelection.vue";
import VoiceSelectionCard from "~/components/shared/engine/audio/VoiceSelectionCard.vue";

const store = useBuilderStore();
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
    </CardContent>
  </Card>
</template>
