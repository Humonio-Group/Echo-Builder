import { useMagicKeys, whenever } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";

export interface KeyboardShortcut {
  key: string;
  description: string;
  handler: () => void;
  enabled?: MaybeRefOrGetter<boolean>;
  once?: boolean; // If true, executes only once per key press. If false, executes repeatedly while key is held
}

export interface ShortcutCategory {
  name: string;
  shortcuts: KeyboardShortcut[];
}

export function useKeyboardShortcuts() {
  const shortcuts = ref<ShortcutCategory[]>([]);
  const keys = useMagicKeys();

  /**
   * Register a keyboard shortcut
   * @param category - Category name (e.g., 'general', 'navigation', 'editing')
   * @param shortcut - Shortcut configuration
   */
  const register = (category: string, shortcut: KeyboardShortcut) => {
    const existingCategory = shortcuts.value.find(c => c.name === category);

    if (existingCategory) {
      existingCategory.shortcuts.push(shortcut);
    }
    else {
      shortcuts.value.push({
        name: category,
        shortcuts: [shortcut],
      });
    }

    // Setup the actual key listener
    const keyRef = computed(() => keys[shortcut.key]?.value);
    const once = shortcut.once !== false; // Default to true (execute once per key press)

    if (once) {
      // Execute only once per key press (not repeatedly while held)
      const hasExecuted = ref(false);

      watch(keyRef, (isPressed) => {
        const isEnabled = shortcut.enabled !== undefined
          ? toValue(shortcut.enabled)
          : true;

        if (isPressed && !hasExecuted.value && isEnabled) {
          shortcut.handler();
          hasExecuted.value = true;
        }
        else if (!isPressed) {
          // Reset when key is released
          hasExecuted.value = false;
        }
      });
    }
    else {
      // Execute repeatedly while key is held (default behavior)
      whenever(keyRef, () => {
        const isEnabled = shortcut.enabled !== undefined
          ? toValue(shortcut.enabled)
          : true;

        if (isEnabled) {
          shortcut.handler();
        }
      });
    }
  };

  /**
   * Register multiple shortcuts at once
   * @param category - Category name
   * @param shortcutList - Array of shortcuts
   */
  const registerMultiple = (category: string, shortcutList: KeyboardShortcut[]) => {
    shortcutList.forEach(shortcut => register(category, shortcut));
  };

  /**
   * Get all registered shortcuts (useful for displaying a shortcuts help panel)
   */
  const getAllShortcuts = () => shortcuts.value;

  /**
   * Get shortcuts by category
   */
  const getByCategory = (category: string) => {
    return shortcuts.value.find(c => c.name === category)?.shortcuts || [];
  };

  return {
    register,
    registerMultiple,
    getAllShortcuts,
    getByCategory,
    keys, // Expose keys for advanced usage
  };
}
