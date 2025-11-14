<script setup lang="ts">
import { CircleHelp, Plus } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";
import AddQuestionDropdownMenu from "~/components/shared/questions/AddQuestionDropdownMenu.vue";
import QuestionRender from "~/components/shared/questions/QuestionRender.vue";

definePageMeta({
  nameKey: "navigation.customize",
});

const scrollElement = ref();

const store = useBuilderStore();
const { attributes } = storeToRefs(store);

function scroll() {
  setTimeout(() => scrollElement.value.scrollIntoView({ behavior: "smooth" }), 0);
}
</script>

<template>
  <Page
    name="customize"
    class="flex flex-col items-center"
  >
    <div class="w-full max-w-xl grid gap-6">
      <template v-if="attributes.questions.length">
        <QuestionRender
          v-for="(question, index) in attributes.questions"
          :key="`q-${index}`"
          :question="question"
        />
      </template>
      <Empty v-else>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleHelp />
          </EmptyMedia>
          <EmptyTitle>
            {{ $t("pages.customize.empty.title") }}
          </EmptyTitle>
          <EmptyDescription>
            {{ $t("pages.customize.empty.description") }}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddQuestionDropdownMenu
            align="center"
            side="bottom"
            @added="scroll"
          >
            <Button><Plus /> {{ $t("pages.customize.empty.button") }}</Button>
          </AddQuestionDropdownMenu>
        </EmptyContent>
      </Empty>

      <AddQuestionDropdownMenu @added="scroll">
        <Button
          class="size-14 [&_>svg]:size-6! rounded-full fixed bottom-6 right-6 transition-all"
          :class="{ 'bottom-0 translate-y-[100%]': !attributes.questions.length }"
        >
          <Plus />
        </Button>
      </AddQuestionDropdownMenu>
    </div>
    <div
      ref="scrollElement"
      class="h-0"
    />
  </Page>
</template>
