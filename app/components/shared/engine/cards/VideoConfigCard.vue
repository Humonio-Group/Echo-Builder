<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import ReplicaSelectionCard from "~/components/shared/engine/video/ReplicaSelectionCard.vue";

const store = useBuilderStore();
</script>

<template>
  <Card class="gap-4">
    <CardHeader class="grid-rows-1!">
      <CardTitle
        class="flex items-center gap-2"
        :class="{ 'text-destructive': store.invalidReplica }"
      >
        {{ $t("pages.engine.video.title") }}

        <Tooltip v-if="store.invalidReplica">
          <TooltipTrigger>
            <AlertCircle class="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ $t("labels.tooltips.has-error") }}</p>
          </TooltipContent>
        </Tooltip>
      </CardTitle>
    </CardHeader>

    <CardContent class="grid gap-4">
      <ReplicaSelectionCard />
    </CardContent>
  </Card>
</template>
