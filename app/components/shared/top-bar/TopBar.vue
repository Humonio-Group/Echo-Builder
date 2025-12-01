<script setup lang="ts">
import { DoorClosed, Download, Save } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import LanguageSelector from "~/components/shared/top-bar/LanguageSelector.vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const companyStore = useCompanyStore();
const { icon } = storeToRefs(companyStore);

const builderStore = useBuilderStore();
const { touched } = storeToRefs(builderStore);

const quitConfirm = ref<boolean>(false);
const { disableConfirmation, shouldConfirmBeforeUnload } = useBeforeUnload();

function handleCloseRequest() {
  if (shouldConfirmBeforeUnload.value) quitConfirm.value = true;
  else closeTab();
}
function closeTab() {
  disableConfirmation();
  nextTick(() => {
    try {
      window.close();
    }
    catch {
      console.info("Current tab can be closed safely!");
    }
  });
}
</script>

<template>
  <header :class="cn('sticky top-0 z-10 flex items-center -mx-6 px-6 md:px-8 gap-1 bg-background py-2 border-b', props.class)">
    <NuxtImg
      v-if="icon"
      :src="icon"
      class="h-10"
    />

    <nav class="flex-1 flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost">
            {{ $t("navigation.file.DEFAULT") }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger :disabled="touched">
                <Download />
                {{ $t("navigation.file.export-to-scorm.DEFAULT") }}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem @click="builderStore.export('1.2')">
                    <Download />
                    {{ $t("navigation.file.export-to-scorm.scorm-12") }}
                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="builderStore.export('2004')">
                    <Download />
                    {{ $t("navigation.file.export-to-scorm.scorm-2004") }}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              :disabled="builderStore.isInvalid"
              @click="builderStore.save()"
            >
              <Save />
              {{ $t("navigation.file.save") }}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="builderStore.isInvalid"
              @click="builderStore.save(true)"
            >
              <Save />
              {{ $t("navigation.file.save-and-close") }}
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleCloseRequest">
              <DoorClosed />
              {{ $t("navigation.file.close-without-saving") }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useRelativePath('/general')"
          active-class="bg-secondary! text-secondary-foreground!"
        >
          {{ $t("navigation.general") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useRelativePath('/customize')"
          active-class="bg-secondary! text-secondary-foreground!"
        >
          {{ $t("navigation.customize") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useRelativePath('/engine')"
          active-class="bg-secondary! text-secondary-foreground!"
        >
          {{ $t("navigation.engine") }}
        </NuxtLinkLocale>
      </Button>
      <Button
        variant="ghost"
        as-child
      >
        <NuxtLinkLocale
          :to="useRelativePath('/evaluation')"
          active-class="bg-secondary! text-secondary-foreground!"
        >
          {{ $t("navigation.evaluation") }}
        </NuxtLinkLocale>
      </Button>
    </nav>

    <div class="flex items-center gap-3">
      <!-- <span class="text-xs text-muted-foreground">{{ $t("labels.saved-since.moment-ago") }}</span> -->
      <LanguageSelector />
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            size="icon"
            variant="ghost"
            :disabled="builderStore.isInvalid"
            @click="builderStore.save"
          >
            <Save />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ $t("btn.save") }}
          <Kbd>⌘S</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>

    <AlertDialog v-model:open="quitConfirm">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {{ $t("alerts.close-with-changes.title") }}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {{ $t("alerts.close-with-changes.description") }}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {{ $t("alerts.close-with-changes.cancel") }}
          </AlertDialogCancel>
          <AlertDialogAction @click="closeTab">
            {{ $t("alerts.close-with-changes.confirm") }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </header>
</template>
