<script setup lang="ts">
import { AlertCircle, ChevronDown, ChevronUp, CircleQuestionMark, Edit, Plus, Trash } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";

const fileInput = ref();
const avatarUrl = ref<string | null>(null);

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);
const { name, description, modes, questions } = toRefs(attributes.value);

const hasModes = computed(() => Object.values(modes.value).some(v => !!v));
const invalidName = computed(() => !name.value?.trim().length);
const invalidDescription = computed(() => !description.value?.trim().length);

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
    <div class="w-full max-w-xl gap-6 flex flex-col py-8">
      <div class="mx-auto relative">
        <Avatar class="size-36">
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
          class="absolute bottom-2 right-2"
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
          v-model="name"
          placeholder="Bienvenue sur Echo"
          :class="{ 'border-destructive': invalidName }"
        />
      </section>
      <section class="space-y-2">
        <Label
          for="description"
          :class="{ 'text-destructive': invalidDescription }"
        >{{ $t("pages.general.simulation-description") }}</Label>
        <Textarea
          id="description"
          v-model="description"
          class="resize-none min-h-32"
          :class="{ 'border-destructive': invalidDescription }"
        />
      </section>
      <Separator />

      <section class="grid gap-4">
        <header class="grid gap-2">
          <h2 class="text-xl font-black">
            {{ $t("pages.general.modes.label") }}
          </h2>
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
        </header>

        <main class="flex flex-col gap-2">
          <Label
            class="block w-full"
            for="text"
          >
            <Card>
              <CardContent class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.text.title") }}</CardTitle>
                  <CardDescription>{{ $t("pages.general.modes.text.description") }}</CardDescription>
                </div>

                <Switch
                  id="text"
                  :model-value="modes.text"
                  @update:model-value="modes.text = $event"
                />
              </CardContent>
            </Card>
          </Label>
          <Label
            class="block w-full"
            for="audio"
          >
            <Card>
              <CardContent class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.audio.title") }}</CardTitle>
                  <CardDescription>{{ $t("pages.general.modes.audio.description") }}</CardDescription>
                </div>

                <Switch
                  id="audio"
                  :model-value="modes.audio"
                  @update:model-value="modes.audio = $event"
                />
              </CardContent>
            </Card>
          </Label>
          <Label
            class="block w-full"
            for="video"
          >
            <Card>
              <CardContent class="w-full flex items-center justify-between">
                <div>
                  <CardTitle>{{ $t("pages.general.modes.video.title") }}</CardTitle>
                  <CardDescription>{{ $t("pages.general.modes.video.description") }}</CardDescription>
                </div>

                <Switch
                  id="video"
                  :model-value="modes.video"
                  @update:model-value="modes.video = $event"
                />
              </CardContent>
            </Card>
          </Label>
        </main>
      </section>
      <Separator />

      <section class="grid gap-4">
        <header class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-black">
              {{ $t("pages.general.questions.label") }}
            </h2>
            <span class="max-w-[45ch] text-sm text-muted-foreground">
              {{ $t("pages.general.questions.description") }}
            </span>
          </div>

          <Button
            v-if="questions.length"
            size="icon"
            variant="ghost"
            @click="builderStore.addQuestion()"
          >
            <Plus />
          </Button>
        </header>

        <main class="grid gap-2">
          <template v-if="questions.length">
            <div
              v-for="(question, index) in questions"
              :key="`${question}-${index}`"
              class="group flex items-center dark:bg-input/30 border border-input rounded-md relative"
            >
              <div class="absolute pr-3 left-0 flex items-center -translate-x-[100%] opacity-0 group-hover:opacity-100">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  :disabled="index <= 0"
                  @click="builderStore.moveUp(index)"
                >
                  <ChevronUp />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  :disabled="index >= questions.length - 1"
                  @click="builderStore.moveDown(index)"
                >
                  <ChevronDown />
                </Button>
              </div>

              <Input
                v-model="question.value"
                class="border-none bg-transparent! ring-0!"
              />
              <span class="grid place-items-center w-[8ch] border-l border-input dark:bg-input/30 text-muted-foreground font-medium rounded-r-md h-full px-4">#{{ question.order }}</span>

              <div class="pl-3 absolute right-0 translate-x-[100%] opacity-0 group-hover:opacity-100">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  class="text-destructive! hover:bg-destructive/10! dark:hover:bg-destructive/20!"
                  @click="builderStore.removeQuestion(question.order)"
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </template>
          <Empty v-else>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleQuestionMark />
              </EmptyMedia>
              <EmptyTitle>
                {{ $t("pages.general.questions.empty.title") }}
              </EmptyTitle>
              <EmptyDescription>
                {{ $t("pages.general.questions.empty.description") }}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button @click="builderStore.addQuestion()">
                <Plus />
                {{ $t("pages.general.questions.empty.button") }}
              </Button>
            </EmptyContent>
          </Empty>
        </main>
      </section>
    </div>
  </Page>
</template>
