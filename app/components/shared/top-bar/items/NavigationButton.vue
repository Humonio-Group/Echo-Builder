<script setup lang="ts">
import { Info } from "lucide-vue-next";

withDefaults(defineProps<{
  link: string;
  labelKey: string;
  hasError: boolean;
  errorsKey?: string;
}>(), {
  errorsKey: "has-error",
});
</script>

<template>
  <Button
    variant="ghost"
    as-child
  >
    <NuxtLinkLocale
      :to="useRelativePath(link)"
      active-class="bg-secondary! text-secondary-foreground!"
    >
      <span :class="{ 'text-orange-400! dark:text-orange-300!': hasError }">
        {{ $t(`navigation.${labelKey}`) }}
      </span>

      <Tooltip v-if="hasError">
        <TooltipTrigger as-child>
          <div>
            <Info class="text-orange-400 dark:text-orange-300" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {{ $t(`labels.tooltips.${errorsKey}`) }}
        </TooltipContent>
      </Tooltip>
    </NuxtLinkLocale>
  </Button>
</template>
