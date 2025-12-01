<script setup lang="ts">
import "flag-icons";
import { Info } from "lucide-vue-next";

const { locale, locales } = useI18n();

const store = useBuilderStore();
const { languages } = storeToRefs(store);

function switchLocale(loc: string) {
  navigateTo(useSwitchLocalePath()(loc as "fr" | "en" | "de"));
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        size="icon-sm"
        variant="ghost"
      >
        <span :class="`fi fi-${locale.replace('en', 'gb')}`" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      side="bottom"
    >
      <DropdownMenuItem
        v-for="lang in languages"
        :key="lang"
        @click="switchLocale(lang)"
      >
        <span :class="`fi fi-${lang.replace('en', 'gb')}`" /> {{ locales.find(l => l.code === lang)?.name }}

        <Tooltip v-if="store.invalidTranslations.includes(lang)">
          <TooltipTrigger as-child>
            <div>
              <Info class="text-orange-400 dark:text-orange-300" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {{ $t("labels.tooltips.missing-translations") }}
          </TooltipContent>
        </Tooltip>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
