<script setup lang="ts">
import { Mars, Square, Venus, Volume2, VolumeOff } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";

definePageMeta({
  nameKey: "navigation.engine",
});

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);

const promptLength = computed(() => attributes.value.config.systemPrompt.trim().length);
const invalidSystemPrompt = computed(() => promptLength.value <= 200);

const hasVoicePreview = ref(true);
const hasReplicaPreview = ref(false);
const isPlayingVoicePreview = ref<boolean>(false);
const voicePlaying = ref<Audio | null>(null);
const isPlayingReplicaPreview = ref<boolean>(false);

watch(isPlayingVoicePreview, (val) => {
  if (val) {
    voicePlaying.value = new Audio("/audio/voice.mp3");
    voicePlaying.value.play();
  }

  if (!val && !!voicePlaying.value) {
    voicePlaying.value!.pause();
    voicePlaying.value = null;
  }
});
</script>

<template>
  <Page
    name="engine"
    class="flex justify-center"
  >
    <div class="w-full max-w-xl gap-6 flex flex-col py-8">
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

      <div
        v-if="attributes.modes.text || attributes.modes.audio"
        class="space-y-2 flex items-center justify-between"
      >
        <Label for="engine-model">
          {{ $t("pages.engine.text-model") }}
        </Label>
        <Select
          id="engine-model"
          v-model="attributes.config.model"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{{ $t("labels.models.light-models") }}</SelectLabel>
              <SelectItem value="gpt-4o-mini">
                GPT-4o-mini
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>{{ $t("labels.models.heavy-models") }}</SelectLabel>
              <SelectItem value="gpt-5">
                GPT-5
              </SelectItem>
              <SelectItem value="grok">
                Grok
              </SelectItem>
              <SelectItem value="mistral-large">
                Mistral Large
              </SelectItem>
              <SelectItem value="deepseek">
                Deepseek
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        v-if="attributes.modes.audio"
        class="space-y-2 flex items-center justify-between"
      >
        <div>
          <Label for="engine-model">
            {{ $t("pages.engine.audio-voice.label") }}
          </Label>
          <span class="text-sm text-muted-foreground">
            {{ $t("pages.engine.audio-voice.description") }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="ghost"
            :disabled="!hasVoicePreview"
            @click="isPlayingVoicePreview = !isPlayingVoicePreview"
          >
            <Square v-if="isPlayingVoicePreview" />
            <Volume2 v-else-if="hasVoicePreview" />
            <VolumeOff v-else />
          </Button>
          <Select
            id="engine-model"
            v-model="attributes.config.audio.voice"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="rebecca">
                Rebecca <Venus class="text-pink-400 dark:text-pink-300" />
              </SelectItem>
              <SelectItem value="rony">
                Rony <Mars class="text-blue-400 dark:text-blue-300" />
              </SelectItem>
              <SelectItem value="charlie">
                Charlie <Venus class="text-pink-400 dark:text-pink-300" />
              </SelectItem>
              <SelectItem value="roy">
                Roy <Mars class="text-blue-400 dark:text-blue-300" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        v-if="attributes.modes.video"
        class="space-y-2 flex items-center justify-between"
      >
        <div>
          <Label for="engine-model">
            {{ $t("pages.engine.video-replica.label") }}
          </Label>
          <span class="text-sm text-muted-foreground">
            {{ $t("pages.engine.video-replica.description") }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            :disabled="!hasReplicaPreview"
            @click="isPlayingReplicaPreview = !isPlayingReplicaPreview"
          >
            <Square v-if="isPlayingReplicaPreview" />
            <Volume2 v-else-if="hasReplicaPreview" />
            <VolumeOff v-else />
          </Button>
          <Select
            id="engine-model"
            v-model="attributes.config.video.replica"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="john">
                John <Mars class="text-blue-400 dark:text-blue-300" />
              </SelectItem>
              <SelectItem value="ashley">
                Ashley <Venus class="text-pink-400 dark:text-pink-300" />
              </SelectItem>
              <SelectItem value="serena">
                Serena <Venus class="text-pink-400 dark:text-pink-300" />
              </SelectItem>
              <SelectItem value="jake">
                Jake <Mars class="text-blue-400 dark:text-blue-300" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </Page>
</template>
