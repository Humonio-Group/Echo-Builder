<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { Dialog } from "~/components/ui/dialog";

const store = useBuilderStore();
const { attributes, replicas, loading: _loading, selectedReplica } = storeToRefs(store);

const previewOpened = ref<boolean>(false);

const loading = computed(() => _loading.value.replicas);

store.loadReplicas();
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <Label
        for="engine-model"
        :class="{ 'text-destructive': !attributes.config.video.replica?.length }"
      >
        {{ $t("pages.engine.video.replica.label") }}
      </Label>
      <span class="text-sm text-muted-foreground">
        {{ $t("pages.engine.video.replica.description") }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <Dialog v-model:open="previewOpened">
        <DialogTrigger as-child>
          <Button
            size="icon-sm"
            variant="ghost"
            :disabled="!selectedReplica?.thumbnail_video_url"
          >
            <Eye v-if="selectedReplica?.thumbnail_video_url" />
            <EyeOff v-else />
          </Button>
        </DialogTrigger>
        <DialogContent class="p-0! max-w-4xl! isolate">
          <Spinner class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
          <video
            v-if="previewOpened"
            class="w-full max-h-[80dvh] rounded-lg"
            :src="selectedReplica?.thumbnail_video_url"
            autoplay
          />
        </DialogContent>
      </Dialog>

      <Spinner v-if="!store.hasFirstLoadedReplicas && loading" />
      <Select
        v-if="store.hasFirstLoadedReplicas && replicas?.length"
        id="engine-model"
        v-model="attributes.config.video.replica"
      >
        <SelectTrigger :class="{ 'border-destructive! text-destructive/50!': !attributes.config.video.replica?.length }">
          <SelectValue :placeholder="$t('pages.engine.video.replica.placeholder')" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem
            v-for="replica in (replicas ?? [])"
            :key="replica.id"
            :value="replica.id"
          >
            {{ replica.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
