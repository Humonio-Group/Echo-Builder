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
  <Card>
    <CardContent>
      <div class="flex items-center justify-between">
        <div>
          <Label for="engine-model">
            {{ $t("pages.engine.video-replica.label") }}
          </Label>
          <span class="text-sm text-muted-foreground">
            {{ $t("pages.engine.video-replica.description") }}
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
            <DialogContent class="p-0! max-w-4xl!">
              <video
                v-if="previewOpened"
                class="w-full max-h-[80dvh] rounded-lg"
                :src="selectedReplica?.thumbnail_video_url"
                autoplay
              />
            </DialogContent>
          </Dialog>

          <Spinner v-if="!store.hasFirstLoadedVoices && loading" />
          <Select
            v-if="store.hasFirstLoadedVoices && replicas?.length"
            id="engine-model"
            v-model="attributes.config.video.replica"
          >
            <SelectTrigger>
              <SelectValue />
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
    </CardContent>
  </Card>
</template>
