<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import "vue-sonner/style.css";

const { enableConfirmation, disableConfirmation, shouldConfirmBeforeUnload } = useBeforeUnload();

const builderStore = useBuilderStore();
builderStore.$subscribe((x) => {
  console.log(x, builderStore.touched);
  if (x.events.key === "touched") return;
  builderStore.touch();
});
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
