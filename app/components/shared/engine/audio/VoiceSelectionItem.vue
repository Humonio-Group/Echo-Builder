<script setup lang="ts">
interface VoiceItemProps {
  voice: Voice;
}

defineProps<VoiceItemProps>();
</script>

<template>
  <SelectItem :value="voice.id">
    <span :class="`text-xs fi fi-${voice.language.replace('en', 'gb')}`" />

    {{ voice.name }}
  </SelectItem>
</template>
