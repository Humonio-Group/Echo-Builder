<script setup lang="ts">
import { AlertCircle, Edit } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";

const locale = useI18n().locale;

definePageMeta({
  nameKey: "navigation.general",
});

const fileInput = ref();
const avatarUrl = ref<string | null>("/images/ia-avatar.gif");

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);
const { name, description, modes } = toRefs(attributes.value);

const hasModes = computed(() => Object.values(modes.value).some(v => !!v));
const invalidName = computed(() => !name.value?.[locale.value]!.trim().length);
const invalidDescription = computed(() => !description.value?.[locale.value]!.trim().length);

function openFileDialog() {
  fileInput.value.click();
}
function handleFileUpload(event: InputEvent) {
  const file: File | undefined = (event.target as HTMLInputElement)!.files![0];
  if (!file) {
    avatarUrl.value = null;
    return;
  }

  avatarUrl.value = URL.createObjectURL(file);
}
</script>

<template>
  <Page
    name="general"
    class="flex justify-center"
  >
    <div class="w-full max-w-3xl gap-6 flex flex-col py-6">
      <header>
        <h1 class="text-2xl font-black">
          {{ $t("pages.general.title") }}
        </h1>
        <p class="text-muted-foreground">
          {{ $t("pages.general.description") }}
        </p>
      </header>

      <Card>
        <CardContent class="grid gap-4">
          <section class="grid grid-cols-[min-content_1fr] gap-4 items-center">
            <div class="mx-auto relative">
              <Avatar class="size-18">
                <AvatarImage
                  v-if="avatarUrl"
                  :src="avatarUrl"
                />
                <AvatarFallback class="text-2xl">
                  Si
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon-sm"
                variant="secondary"
                class="absolute -bottom-1 -right-1"
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
                @change="handleFileUpload"
              >
            </div>
            <section class="space-y-2">
              <Label
                for="name"
                :class="{ 'text-destructive': invalidName }"
              >{{ $t("pages.general.simulation-title") }}</Label>
              <Input
                id="name"
                v-model="name[locale]"
                placeholder="Bienvenue sur Echo"
                :class="{ 'border-destructive': invalidName }"
              />
            </section>
          </section>
          <section class="space-y-2">
            <Label
              for="description"
              :class="{ 'text-destructive': invalidDescription }"
            >{{ $t("pages.general.simulation-description") }}</Label>
            <Textarea
              id="description"
              v-model="description[locale]"
              class="resize-none min-h-32"
              :class="{ 'border-destructive': invalidDescription }"
            />
          </section>
        </CardContent>
      </Card>

      <Card class="gap-4">
        <CardHeader class="flex flex-col">
          <CardTitle>
            {{ $t("pages.general.modes.label") }}
          </CardTitle>
          <Alert
            v-if="!hasModes"
            variant="destructive"
          >
            <AlertCircle />
            <AlertTitle>
              {{ $t("pages.general.modes.no-mode-selected.title") }}
            </AlertTitle>
            <AlertDescription>
              {{ $t("pages.general.modes.no-mode-selected.description") }}
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <main class="flex flex-col gap-2">
            <Label
              class="block w-full"
              for="text"
            >
              <div class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.text.title") }}</CardTitle>
                  <CardDescription class="font-normal!">{{ $t("pages.general.modes.text.description") }}</CardDescription>
                </div>

                <Switch
                  id="text"
                  :model-value="modes.text"
                  @update:model-value="modes.text = $event"
                />
              </div>
            </Label>
            <Label
              class="block w-full"
              for="audio"
            >
              <div class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.audio.title") }}</CardTitle>
                  <CardDescription class="font-normal!">{{ $t("pages.general.modes.audio.description") }}</CardDescription>
                </div>

                <Switch
                  id="audio"
                  :model-value="modes.audio"
                  @update:model-value="modes.audio = $event"
                />
              </div>
            </Label>
            <Label
              class="block w-full"
              for="video"
            >
              <div class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.video.title") }}</CardTitle>
                  <CardDescription class="font-normal!">{{ $t("pages.general.modes.video.description") }}</CardDescription>
                </div>

                <Switch
                  id="video"
                  :model-value="modes.video"
                  @update:model-value="modes.video = $event"
                />
              </div>
            </Label>
          </main>
        </CardContent>
      </Card>
    </div>
  </Page>
</template>
