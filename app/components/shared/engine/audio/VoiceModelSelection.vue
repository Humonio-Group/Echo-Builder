<script setup lang="ts">
import { ELEVENLABS_MODELS } from "#shared/types/elevenlabs";

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div class="grid">
      <Label for="voice-model">{{ $t("pages.engine.audio.model.label") }}</Label>
      <span class="text-sm text-muted-foreground">
        {{ $t("pages.engine.audio.model.description") }}
      </span>
    </div>

    <Select
      id="voice-model"
      v-model="attributes.config.audio.model"
    >
      <SelectTrigger>
        {{ $t(`pages.engine.audio.models.${attributes.config.audio.model}.name`) }}
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="model in ELEVENLABS_MODELS"
          :key="model"
          :value="model"
        >
          <div class="grid">
            <span>{{ $t(`pages.engine.audio.models.${model}.name`) }}</span>
            <span class="text-xs text-muted-foreground">{{ $t(`pages.engine.audio.models.${model}.caption`) }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
