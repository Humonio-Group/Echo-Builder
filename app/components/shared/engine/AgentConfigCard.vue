<script setup lang="ts">
import TemperatureInput from "~/components/shared/engine/TemperatureInput.vue";
import VoiceModelSelection from "~/components/shared/engine/audio/VoiceModelSelection.vue";
import VoiceSelectionCard from "~/components/shared/engine/audio/VoiceSelectionCard.vue";
import ReplicaSelectionCard from "~/components/shared/engine/ReplicaSelectionCard.vue";

const { attributes } = storeToRefs(useBuilderStore());

const hasAudio = computed(() => attributes.value.modes.audio);
const hasVideo = computed(() => attributes.value.modes.video);
</script>

<template>
  <Card class="gap-4">
    <CardHeader class="flex flex-col">
      <CardTitle>
        {{ $t("pages.engine.agent") }}
      </CardTitle>
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
