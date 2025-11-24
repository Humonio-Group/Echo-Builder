export const useWindowContext = () => {
  const close = () => {
    try {
      window.close();
    }
    catch {
      console.info("You can now close the window safely!");
    }
  };

  return { close };
};
