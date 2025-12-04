<script setup lang="ts">
import { Square, Volume2, VolumeOff } from "lucide-vue-next";
import VoiceSelectionItem from "~/components/shared/engine/audio/VoiceSelectionItem.vue";

const store = useBuilderStore();
const { attributes, voices, loading: _loading, selectedVoice } = storeToRefs(store);

const loading = computed(() => _loading.value.replicas);

store.loadVoices();

const isPlayingVoicePreview = ref<boolean>(false);
const voicePlaying = ref<Audio | null>(null);

const maleVoices = computed(() => voices.value?.filter(voice => voice.gender === "male") ?? []);
const femaleVoices = computed(() => voices.value?.filter(voice => voice.gender === "female") ?? []);
const otherVoices = computed(() => voices.value?.filter(voice => voice.gender !== "male" && voice.gender !== "female") ?? []);

function clearAudio() {
  voicePlaying.value!.pause();
  voicePlaying.value = null;
}

watch(selectedVoice, () => {
  isPlayingVoicePreview.value = false;
});
watch(isPlayingVoicePreview, (val) => {
  if (val) {
    voicePlaying.value = new Audio(selectedVoice.value?.preview_url);
    voicePlaying.value.onended = () => isPlayingVoicePreview.value = false;
    voicePlaying.value.play();
  }

  if (!val && !!voicePlaying.value) clearAudio();
});
onBeforeUnmount(() => {
  if (!voicePlaying.value) return;
  voicePlaying.value.pause();
  voicePlaying.value = null;
});
</script>

<template>
  <div class="flex items-center justify-between gap-4 md:gap-8">
    <div class="grid">
      <Label
        for="engine-model"
        :class="{ 'text-destructive': !attributes.config.audio.voice?.length }"
      >
        {{ $t("pages.engine.audio.voice.label") }}
      </Label>
      <span class="text-sm text-muted-foreground">
        {{ $t("pages.engine.audio.voice.description") }}
      </span>
    </div>
    <div class="flex items-center gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        :disabled="!selectedVoice?.preview_url"
        @click="isPlayingVoicePreview = !isPlayingVoicePreview"
      >
        <Square v-if="isPlayingVoicePreview" />
        <Volume2 v-else-if="selectedVoice?.preview_url" />
        <VolumeOff v-else />
      </Button>

      <Spinner v-if="!store.hasFirstLoadedVoices && loading" />
      <Select
        v-if="store.hasFirstLoadedVoices && voices?.length"
        id="engine-model"
        v-model="attributes.config.audio.voice"
      >
        <SelectTrigger
          class="max-w-[200px]"
          :class="{ 'border-destructive! text-destructive/50!': !attributes.config.audio.voice?.length }"
        >
          <SelectValue
            class="truncate"
            :placeholder="$t('pages.engine.video.replica.placeholder')"
          />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>
              {{ $t("labels.genders.female", 2) }}
            </SelectLabel>

            <VoiceSelectionItem
              v-for="voice in femaleVoices"
              :key="voice.id"
              :voice="voice"
            />
          </SelectGroup>

          <SelectGroup class="mt-4">
            <SelectLabel>
              {{ $t("labels.genders.male", 2) }}
            </SelectLabel>

            <VoiceSelectionItem
              v-for="voice in maleVoices"
              :key="voice.id"
              :voice="voice"
            />
          </SelectGroup>

          <SelectGroup class="mt-4">
            <SelectLabel>
              {{ $t("labels.genders.other", 2) }}
            </SelectLabel>

            <VoiceSelectionItem
              v-for="voice in otherVoices"
              :key="voice.id"
              :voice="voice"
            />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
