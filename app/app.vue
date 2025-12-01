<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import "vue-sonner/style.css";

const { enableConfirmation, disableConfirmation, shouldConfirmBeforeUnload } = useBeforeUnload();

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);
watch(attributes, () => builderStore.touch(), { deep: true });

const { touched } = storeToRefs(builderStore);
watch(touched, (val) => {
  if (val) enableConfirmation();
  else disableConfirmation();
});

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (shouldConfirmBeforeUnload.value) {
    event.preventDefault();
    event.returnValue = "";
  }
};

const companyStore = useCompanyStore();
const { colors } = storeToRefs(companyStore);

watch(colors, (newColors) => {
  if (newColors?.first && import.meta.client) {
    document.documentElement.style.setProperty("--primary", `#${newColors.first}`);
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <Toaster
      :theme="$colorMode.preference"
      close-button
      close-button-position="top-right"
      rich-colors
      position="top-right"
    />

    <TooltipProvider>
      <NuxtLayout />
    </TooltipProvider>
  </div>
</template>
