<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";
import AgentConfigCard from "~/components/shared/engine/AgentConfigCard.vue";

definePageMeta({
  nameKey: "navigation.engine",
});

const store = useBuilderStore();
const { attributes } = storeToRefs(store);

const promptLength = computed(() => attributes.value.config.systemPrompt.trim().length);
const invalidSystemPrompt = computed(() => promptLength.value <= 200);
const validEnd = computed(() => {
  const byUser = attributes.value.config.end.user;
  const byAgent = attributes.value.config.end.agent;
  const time = attributes.value.config.end.time;
  const duration = attributes.value.config.end.duration;

  return byUser
    || byAgent
    || (time && duration)
  ;
});
</script>

<template>
  <Page
    name="engine"
    class="flex justify-center"
  >
    <div class="w-full max-w-3xl gap-6 flex flex-col py-6">
      <header>
        <h1 class="text-2xl font-black">
          {{ $t("pages.engine.title") }}
        </h1>
        <p class="text-muted-foreground">
          {{ $t("pages.engine.description") }}
        </p>
      </header>

      <AgentConfigCard />

      <Card class="gap-4">
        <CardHeader class="flex flex-col">
          <CardTitle>
            {{ $t("pages.engine.end-modes.label") }}
          </CardTitle>
          <Alert
            v-if="!validEnd"
            variant="destructive"
          >
            <AlertCircle />
            <AlertTitle>
              {{ $t("pages.engine.end-modes.no-end-mode-selected.title") }}
            </AlertTitle>
            <AlertDescription>
              {{ $t("pages.engine.end-modes.no-end-mode-selected.description") }}
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent class="grid gap-4">
          <Label
            class="flex items-center justify-between gap-4"
            for="end-by-user"
          >
            <div class="grid">
              <span class="text-sm font-medium">{{ $t("pages.engine.end-modes.by-user.label") }}</span>
              <span class="text-sm text-muted-foreground">{{ $t("pages.engine.end-modes.by-user.description") }}</span>
            </div>

            <Switch
              id="end-by-user"
              :model-value="attributes.config.end.user"
              @update:model-value="attributes.config.end.user = $event"
            />
          </Label>
          <div class="grid gap-2">
            <Label
              class="flex items-center justify-between gap-4"
              for="end-by-time"
            >
              <div class="grid">
                <span class="text-sm font-medium">{{ $t("pages.engine.end-modes.by-time.label") }}</span>
                <span class="text-sm text-muted-foreground">{{ $t("pages.engine.end-modes.by-time.description") }}</span>
              </div>

              <Switch
                id="end-by-time"
                :model-value="attributes.config.end.time"
                @update:model-value="attributes.config.end.time = $event"
              />
            </Label>
            <NumberField
              v-if="attributes.config.end.time"
              :min="1"
              :max="60"
              :model-value="attributes.config.end.duration"
              @update:model-value="attributes.config.end.duration = $event"
            >
              <NumberFieldContent>
                <NumberFieldInput />

                <NumberFieldDecrement />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <Label
            class="flex items-center justify-between gap-4"
            for="end-by-ai"
          >
            <div class="grid">
              <span class="text-sm font-medium">{{ $t("pages.engine.end-modes.by-ai.label") }}</span>
              <span class="text-sm text-muted-foreground">{{ $t("pages.engine.end-modes.by-ai.description") }}</span>
            </div>

            <Switch
              id="end-by-ai"
              :model-value="attributes.config.end.agent"
              @update:model-value="attributes.config.end.agent = $event"
            />
          </Label>
        </CardContent>
      </Card>
    </div>
  </Page>
</template>
