<script setup lang="ts">
import { Info } from "lucide-vue-next";
import TemperatureInput from "~/components/shared/engine/TemperatureInput.vue";
import VoiceModelSelection from "~/components/shared/engine/audio/VoiceModelSelection.vue";
import VoiceSelectionCard from "~/components/shared/engine/audio/VoiceSelectionCard.vue";
import ReplicaSelectionCard from "~/components/shared/engine/ReplicaSelectionCard.vue";

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);

const hasAudio = computed(() => attributes.value.modes.audio);
const hasVideo = computed(() => attributes.value.modes.video);
const promptLength = computed(() => attributes.value.config.systemPrompt.trim().length);
const invalidSystemPrompt = computed(() => promptLength.value <= 200);
</script>

<template>
  <Card class="gap-4">
    <CardHeader
      class="flex gap-2"
      :class="{ 'text-destructive!': builderStore.invalidAgent }"
    >
      <CardTitle>
        {{ $t("pages.engine.agent") }}
      </CardTitle>
      <Tooltip>
        <TooltipTrigger>
          <Info
            v-if="builderStore.invalidAgent || attributes.config.temperature >= 1"
            class="size-4"
            :class="{ 'text-orange-400 dark:text-orange-300': !builderStore.invalidAgent && attributes.config.temperature >= 1 }"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p v-if="builderStore.invalidAgent">
            {{ $t("labels.tooltips.has-error") }}
          </p>
          <p v-else-if="attributes.config.temperature >= 1">
            {{ $t("pages.engine.temperature.alert.title") }}
          </p>
        </TooltipContent>
      </Tooltip>
    </CardHeader>
    <CardContent class="grid gap-4">
      <!-- todo: name -->

      <section class="grid gap-4">
        <div class="space-y-2">
          <div class="grid relative">
            <Label
              for="system-prompt"
              :class="{ 'text-destructive': invalidSystemPrompt }"
            >{{ $t("pages.engine.system-prompt.label") }}</Label>
            <span class="text-sm text-muted-foreground font-normal">{{ $t("pages.engine.system-prompt.description") }}</span>
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
      </section>

      <template v-if="hasAudio">
        <Separator />

        <section class="grid gap-4">
          <VoiceModelSelection />
          <VoiceSelectionCard />
        </section>
      </template>

      <template v-if="hasVideo">
        <Separator />

        <section class="grid gap-4">
          <ReplicaSelectionCard />
        </section>
      </template>
    </CardContent>
  </Card>
</template>
