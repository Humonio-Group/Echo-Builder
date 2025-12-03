<script setup lang="ts">
import { TriangleAlert } from "lucide-vue-next";

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <Label for="temperature">{{ $t("pages.engine.temperature.label") }}</Label>
      <span class="text-sm font-bold text-muted-foreground">{{ attributes.config.temperature }}</span>
    </div>
    <Slider
      id="temperature"
      :default-value="[attributes.config.temperature]"
      :model-value="[attributes.config.temperature]"
      :min="0"
      :max="1.5"
      :step="0.05"
      @update:model-value="val => attributes.config.temperature = val?.[0] ?? 0.75"
    />

    <div class="grid grid-cols-3 gap-4">
      <span class="text-xs text-muted-foreground">
        {{ $t("pages.engine.temperature.deterministic") }}
      </span>
      <span class="text-xs text-muted-foreground text-center">
        {{ $t("pages.engine.temperature.standard") }}
      </span>
      <span class="text-xs text-muted-foreground text-end">
        {{ $t("pages.engine.temperature.creative") }}
      </span>
    </div>

    <Alert
      v-if="attributes.config.temperature >= 1"
      variant="warning"
    >
      <TriangleAlert />
      <AlertTitle>{{ $t("pages.engine.temperature.alert.title") }}</AlertTitle>
      <AlertDescription>
        <p>
          <i18n-t keypath="pages.engine.temperature.alert.description">
            <template #value>
              <b>1</b>
            </template>
          </i18n-t>
        </p>
      </AlertDescription>
    </Alert>
  </div>
</template>
