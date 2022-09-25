import { Highlighting } from "./models";

const container = document.getElementById("container");

chrome.storage.sync.get("colors", (res) => {
  let storedColors = res.colors as Highlighting[];

  if (container) {
    storedColors.forEach((c) => {
      const inputRow = document.createElement("div");
      inputRow.className = "row";

      const inputLabel = document.createElement("label");
      // inputLabel.setAttribute("for", c.key + "ColorInput");
      inputLabel.innerText =
        c.key === "empty" ? "Urlaubs und Feiertage" : c.key;
      inputRow.appendChild(inputLabel);

      const inputColor = document.createElement("input");
      inputColor.setAttribute("type", "color");
      inputColor.className = "color-input";
      inputColor.id = c.key + "ColorInput";
      inputColor.value = c.color;
      inputColor.addEventListener("change", (e) => {
        let foundColor = storedColors.find((col) => col.key === c.key);
        if (e.target && foundColor) {
          foundColor.color = (e.target as any).value;
          chrome.storage.sync.set({ colors: storedColors });
        }
      });
      inputRow.appendChild(inputColor);

      container.appendChild(inputRow);
    });
  }
});
