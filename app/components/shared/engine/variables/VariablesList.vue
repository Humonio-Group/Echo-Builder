<script setup lang="ts">
import { Info } from "lucide-vue-next";
import VariableItem from "~/components/shared/engine/variables/VariableItem.vue";

const { locale } = useI18n();

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        size="icon-sm"
        variant="ghost"
      >
        <Info />
      </Button>
    </DialogTrigger>
    <DialogContent class="grid gap-2">
      <template
        v-for="(question, index) in attributes.questions"
        :key="index"
      >
        <VariableItem
          :label="`question_${index + 1}`"
          :description="`Injecter l'intitulé de la question ${index + 1}`"
          :value="question.label[locale]"
        />
        <VariableItem
          :label="`answer_${index + 1}`"
          :description="`Injecter la réponse de l'utilisateur à la question ${index + 1}`"
        />
        <VariableItem
          :label="`q-and-a_${index + 1}`"
          :description="`Injecter l'intitulé de la question ${index + 1}`"
          :value="`${question.label[locale]} -> (défini par l'utilisateur)`"
        />
      </template>
    </DialogContent>
  </Dialog>
</template>
