<script setup lang="ts">
import { Info } from "lucide-vue-next";

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-4">
      <Label class="flex items-center gap-2">
        {{ $t("pages.engine.audio.speed.label") }}

        <Tooltip>
          <TooltipTrigger>
            <Info class="size-3 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            {{ $t("pages.engine.audio.speed.tooltip") }}
          </TooltipContent>
        </Tooltip>
      </Label>

      <span class="text-sm">
        {{ attributes.config.audio.speed.toFixed(2) }}
      </span>
    </div>

    <Slider
      :min="0.7"
      :max="1.2"
      :step="0.01"
      :model-value="[attributes.config.audio.speed]"
      :default-value="[attributes.config.audio.speed]"
      @update:model-value="attributes.config.audio.speed = $event?.[0] ?? 1"
    />

    <div class="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
      <span>
        {{ $t("pages.engine.audio.speed.slower") }}
      </span>
      <span class="text-end">
        {{ $t("pages.engine.audio.speed.faster") }}
      </span>
    </div>
  </div>
</template>
