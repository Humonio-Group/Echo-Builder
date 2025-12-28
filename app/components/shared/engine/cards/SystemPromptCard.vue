<script setup lang="ts">
import { Info } from "lucide-vue-next";
import VariablesList from "~/components/shared/engine/variables/VariablesList.vue";
import TemperatureInput from "~/components/shared/engine/TemperatureInput.vue";

const { attributes } = storeToRefs(useBuilderStore());

const promptLength = computed(() => attributes.value.config.systemPrompt.trim().length);
const invalidSystemPrompt = computed(() => promptLength.value <= 200);
</script>

<template>
  <Card class="gap-4">
    <CardHeader
      class="flex items-center gap-2"
      :class="{ 'text-destructive!': invalidSystemPrompt }"
    >
      <CardTitle>
        {{ $t("pages.engine.agent") }}
      </CardTitle>

      <Tooltip>
        <TooltipTrigger>
          <Info
            v-if="invalidSystemPrompt || attributes.config.temperature >= 1"
            class="size-4"
            :class="{ 'text-orange-400 dark:text-orange-300': !invalidSystemPrompt && attributes.config.temperature >= 1 }"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p v-if="invalidSystemPrompt">
            {{ $t("labels.tooltips.has-error") }}
          </p>
          <p v-else-if="attributes.config.temperature >= 1">
            {{ $t("pages.engine.temperature.alert.title") }}
          </p>
        </TooltipContent>
      </Tooltip>
    </CardHeader>

    <CardContent class="grid gap-4">
      <div class="space-y-2">
        <div class="flex items-end justify-between gap-4">
          <div class="grid relative">
            <Label
              for="system-prompt"
              :class="{ 'text-destructive': invalidSystemPrompt }"
            >{{ $t("pages.engine.system-prompt.label") }}</Label>
            <span class="text-sm text-muted-foreground font-normal">{{ $t("pages.engine.system-prompt.description") }}</span>
          </div>

          <VariablesList />
        </div>

        <div class="relative">
          <Textarea
            id="system-prompt"
            v-model="attributes.config.systemPrompt"
            class="min-h-64! resize-y"
            :class="{ 'border-destructive': invalidSystemPrompt }"
          />
          <span
            v-if="invalidSystemPrompt"
            class="absolute bottom-2 right-2 text-sm text-destructive"
          >{{ promptLength }} / 200</span>
          <span
            v-else
            class="absolute bottom-2 right-2 text-sm text-muted-foreground font-normal"
          >{{ promptLength }}</span>
        </div>
      </div>

      <TemperatureInput />
    </CardContent>
  </Card>
</template>
