<script setup lang="ts">
import { DoorClosed, Download, Save, X } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import LanguageSelector from "~/components/shared/top-bar/LanguageSelector.vue";
import NavigationButton from "~/components/shared/top-bar/items/NavigationButton.vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const showBetaBanner = ref<boolean>(localStorage.getItem("show-beta-banner") !== "false");

const companyStore = useCompanyStore();
const { icon } = storeToRefs(companyStore);

const builderStore = useBuilderStore();
const { touched, invalidTabs } = storeToRefs(builderStore);
const errors = computed(() => ({
  general: invalidTabs.value.includes("general"),
  customize: invalidTabs.value.includes("customize"),
  engine: invalidTabs.value.includes("engine"),
  evaluation: invalidTabs.value.includes("evaluation"),
}));

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
async function disableBetaBanner() {
  if (!showBetaBanner.value) return;

  localStorage.setItem("show-beta-banner", "false");
  showBetaBanner.value = false;
}
</script>

<template>
  <div class="sticky top-0 z-10 grid -mx-6 md:-mx-8">
    <div
      v-if="showBetaBanner"
      class="flex items-center justify-between bg-primary text-primary-foreground px-6 md:px-8 py-2 text-sm font-bold md:mb-0"
    >
      <p>{{ $t("labels.beta.caption") }}</p>

      <Button
        size="icon-sm"
        variant="ghost"
        @click="disableBetaBanner"
      >
        <X />
      </Button>
    </div>

    <header :class="cn(' flex items-center px-6 md:px-8 gap-1 bg-background py-2 border-b', props.class)">
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
                    <DropdownMenuItem
                      disabled
                      @click="builderStore.export('2004')"
                    >
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
              <DropdownMenuItem
                v-if="builderStore.isTouched"
                @click="handleCloseRequest"
              >
                <DoorClosed />
                {{ $t("navigation.file.close-without-saving") }}
              </DropdownMenuItem>
              <DropdownMenuItem
                v-else
                @click="closeTab"
              >
                <DoorClosed />
                {{ $t("navigation.file.close") }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <NavigationButton
          link="/general"
          label-key="general"
          :has-error="errors.general"
        />
        <NavigationButton
          link="/customize"
          label-key="customize"
          :has-error="errors.customize"
        />
        <NavigationButton
          link="/engine"
          label-key="engine"
          :has-error="errors.engine"
        />
        <NavigationButton
          link="/evaluation"
          label-key="evaluation"
          :has-error="errors.evaluation"
        />
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
              @click="builderStore.save(false)"
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
  </div>
</template>
