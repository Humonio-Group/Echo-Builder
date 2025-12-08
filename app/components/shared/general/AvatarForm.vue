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
  <div class="mx-auto relative">
    <Avatar class="size-18">
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
      v-if="loading"
      class="absolute inset-0 grid place-items-center bg-foreground/30 rounded-full text-background"
    >
      <Spinner />
    </div>

    <Button
      size="icon-sm"
      variant="secondary"
      class="absolute -bottom-1 -right-1"
      :disabled="loading"
      @click="openFileDialog"
    >
      <Edit />
    </Button>

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
