<script setup lang="ts">
import { Mars, Square, Venus, Volume2, VolumeOff } from "lucide-vue-next";

const store = useBuilderStore();
const { attributes, voices, loading: _loading, selectedVoice } = storeToRefs(store);

const loading = computed(() => _loading.value.replicas);

store.loadVoices();

const isPlayingVoicePreview = ref<boolean>(false);
const voicePlaying = ref<Audio | null>(null);

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
  <Card>
    <CardContent>
      <div class="flex items-center justify-between">
        <div>
          <Label
            for="engine-model"
            :class="{ 'text-destructive': !attributes.config.audio.voice?.length }"
          >
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
            <SelectTrigger :class="{ 'border-destructive! text-destructive/50!': !attributes.config.audio.voice?.length }">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem
                v-for="voice in (voices ?? [])"
                :key="voice.id"
                :value="voice.id"
              >
                {{ voice.name }}
                <Venus
                  v-if="voice.gender === 'female'"
                  class="text-pink-400 dark:text-pink-300"
                />
                <Mars
                  v-else-if="voice.gender === 'male'"
                  class="text-blue-400 dark:text-blue-300"
                />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
