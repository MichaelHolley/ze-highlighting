chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    colors: [
      {
        key: "empty",
        color: "rgba(84, 181, 75, 0.25)",
      },
    ],
  });

  console.log("DEFAULT SET");
});
