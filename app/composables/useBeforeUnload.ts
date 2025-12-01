export const useBeforeUnload = () => {
  const shouldConfirmBeforeUnload = useState("shouldConfirmBeforeUnload", () => false);

  const enableConfirmation = () => {
    shouldConfirmBeforeUnload.value = true;
  };

  const disableConfirmation = () => {
    shouldConfirmBeforeUnload.value = false;
  };

  return {
    shouldConfirmBeforeUnload: readonly(shouldConfirmBeforeUnload),
    enableConfirmation,
    disableConfirmation,
  };
};
