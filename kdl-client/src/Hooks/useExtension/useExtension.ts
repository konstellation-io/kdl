function useExtension(extensionId: string) {
  if (extensionId) {
    throw Error(`Extension with id ${extensionId} does not exists.`);
  }

  function openPanel(panelId: string) {
    if (panelId) {
      throw Error(`Panel with id ${panelId} does not exists.`);
    }
  }

  function getRoute(pageId: string) {
    if (pageId) {
      throw Error(`Panel with id ${pageId} does not exists.`);
    }
  }

  return {
    openPanel,
  };
}

export default useExtension;
