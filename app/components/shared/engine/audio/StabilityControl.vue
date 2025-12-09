<script setup lang="ts">
import { Info } from "lucide-vue-next";

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-4 justify-between">
      <Label class="flex items-center gap-2">
        {{ $t("pages.engine.audio.stability.label") }}

        <Tooltip>
          <TooltipTrigger>
            <Info class="size-3 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p
              v-if="attributes.config.audio.model === 'eleven_v3'"
              v-html="$t('pages.engine.audio.stability.tooltip-v3').replace(/\n/g, '<br>')"
            />
            <span v-else>{{ $t("pages.engine.audio.stability.tooltip") }}</span>
          </TooltipContent>
        </Tooltip>
      </Label>

      <span class="text-sm">
        {{ (attributes.config.audio.stability * 100).toFixed(0) }}%
      </span>
    </div>

    <Slider
      :min="0"
      :max="1"
      :step="attributes.config.audio.model === 'eleven_v3' ? 0.5 : 0.01"
      :model-value="[attributes.config.audio.stability]"
      :default-value="[attributes.config.audio.stability]"
      @update:model-value="attributes.config.audio.stability = $event?.[0] ?? 0.5"
    />

    <div
      class="grid grid-cols-2 gap-2 text-sm text-muted-foreground"
      :class="{ 'grid-cols-3': attributes.config.audio.model === 'eleven_v3' }"
    >
      <template v-if="attributes.config.audio.model === 'eleven_v3'">
        <span>
          {{ $t("pages.engine.audio.stability.creative") }}
        </span>
        <span class="text-center">
          {{ $t("pages.engine.audio.stability.natural") }}
        </span>
        <span class="text-end">
          {{ $t("pages.engine.audio.stability.robust") }}
        </span>
      </template>
      <template v-else>
        <span>
          {{ $t("pages.engine.audio.stability.variable") }}
        </span>
        <span class="text-end">
          {{ $t("pages.engine.audio.stability.stable") }}
        </span>
      </template>
    </div>
  </div>

  <div
    v-if="attributes.config.audio.model === 'eleven_v3'"
    class="space-y-2"
  />
</template>
