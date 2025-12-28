<script setup lang="ts">
import { Crown } from "lucide-vue-next";

const userStore = useUserStore();
const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <Label
    class="flex items-center justify-between gap-4"
    for="enhance-audio"
    :class="{ 'cursor-not-allowed text-muted-foreground': !userStore.hasAudio }"
  >
    <div class="grid gap-1">
      <span class="flex items-center gap-2">
        {{ $t("pages.engine.video.enhance-audio.label") }}
        <Tooltip v-if="!userStore.hasAudio">
          <TooltipTrigger>
            <Crown class="size-4 text-yellow-500 dark:text-yellow-400" />
          </TooltipTrigger>
          <TooltipContent>
            {{ $t("labels.tooltips.subscriptions.audio", 1) }}
          </TooltipContent>
        </Tooltip>
      </span>
      <span class="text-muted-foreground font-normal!">{{ $t("pages.engine.video.enhance-audio.description") }}</span>
    </div>

    <Switch
      id="enhance-audio"
      :model-value="attributes.config.video.enhance && userStore.hasAudio"
      :disabled="!userStore.hasAudio"
      @update:model-value="attributes.config.video.enhance = $event"
    />
  </Label>
</template>
