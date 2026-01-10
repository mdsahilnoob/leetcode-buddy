export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Open sidepanel when extension icon is clicked
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id && tab.windowId) {
      await browser.sidePanel.open({ windowId: tab.windowId });
    }
  });
});
