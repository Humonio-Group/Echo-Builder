<script setup lang="ts">
import { Edit } from "lucide-vue-next";

const { locale } = useI18n();

const store = useBuilderStore();
const { attributes, loading: _load } = storeToRefs(store);

const fileInput = ref();
const loading = computed(() => _load.value.avatar);

function openFileDialog() {
  fileInput.value.click();
}
function handleFileUpload(event: InputEvent) {
  const file: File | undefined = (event.target as HTMLInputElement)!.files![0];

  if (!file) store.clearAvatar();
  else store.uploadAvatar(file);
}
</script>

<template>
  <div
    class="group/overlay mx-auto relative cursor-pointer"
    :class="{ 'cursor-loading': loading }"
  >
    <Avatar
      class="size-18"
      @click.stop="openFileDialog"
    >
      <AvatarImage
        v-if="attributes.avatar"
        :src="attributes.avatar"
        :class="{ 'blur-xl': loading }"
      />
      <AvatarFallback class="text-2xl">
        {{ attributes.name[locale]?.substring(0, 2) || "??" }}
      </AvatarFallback>
    </Avatar>

    <div
      class="absolute inset-0 grid place-items-center bg-primary/60 rounded-full text-background pointer-events-none opacity-0 group-hover/overlay:opacity-100 transition-opacity"
      :class="{ 'opacity-100! bg-foreground/50!': loading }"
    >
      <Spinner v-if="loading" />
      <Edit v-else />
    </div>

    <input
      ref="fileInput"
      type="file"
      hidden
      class="absolute"
      accept="image/*"
      :disabled="loading"
      @change="handleFileUpload"
    >
  </div>
</template>
