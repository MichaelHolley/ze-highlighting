chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    colors: [
      {
        key: "empty",
        color: "#54B54B",
      },
    ],
  });

  console.log("DEFAULT SET");
});
