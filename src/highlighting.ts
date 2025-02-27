import { Highlighting, Route } from "./models";
import {
  generateRandomColorHex,
  getConfigByPage,
  getRoute,
  hexToRgb,
  isNumeric,
} from "./utils";

highlighting();

addEventListener("hashchange", () => {
  highlighting();
});

chrome.storage.onChanged.addListener(() => {
  highlighting();
});

function highlighting() {
  var route = getRoute();

  if (route === undefined) {
    return;
  }

  const config = getConfigByPage(route);

  const rows = document.getElementsByTagName("tr");
  const cellsToColor: { cell: HTMLTableCellElement; key: string }[] = [];

  for (let row of rows) {
    // set reserved days for holidays
    if (
      ((row.attributes.getNamedItem(config.dataKey)?.value === "" ||
        row.attributes.getNamedItem(config.dataKey)?.value === undefined) &&
        row[route === Route.stundenanzeige ? "className" : "id"] ===
        config.classId) ||
      row?.cells[config.columnIndex + 1]?.innerText
        ?.toLowerCase()
        .includes("urlaub")
    ) {
      let cell = row.getElementsByTagName("td")[config.columnIndex];
      cellsToColor.push({ cell: cell, key: "empty" });
      continue;
    }

    // set project-colors
    if (row.attributes.getNamedItem(config.dataKey)?.value !== "") {
      let projectCell = row.getElementsByTagName("td")[config.columnIndex];

      if (projectCell !== undefined) {
        let key = projectCell.innerText.trim() ?? "empty";

        if (route === Route.stundenanzeige && key.startsWith("Projekt")) {
          key = key.substring("Projekt".length).trim();
        }

        if (
          route === Route.stundenerfassung &&
          key.startsWith("Projekt/Auftrag")
        ) {
          key = key.substring("Projekt/Auftrag".length).trim();
        }

        if (key === "" || !key) {
          key = "empty";
        }

        if (
          isNumeric(key) ||
          key.startsWith("Kunde") ||
          key.includes("Urlaub") ||
          key.match(/[0-9]+: /)
        ) {
          continue;
        }

        cellsToColor.push({ cell: projectCell, key: key });
      }
    }

    if (!!config.descriptionColumIndex) {
      let descriptionCell = row.getElementsByTagName("td")[config.descriptionColumIndex];

      if (descriptionCell !== undefined) {
        let readmore = descriptionCell.querySelector(".readmore");
        if (!!readmore) {
          // remove collapse button
          descriptionCell.querySelector(".readmore-action")?.remove()

          // remove ellipsis from description
          const description: HTMLDivElement = readmore.children[0] as HTMLDivElement;
          if (description !== undefined) {
            description.classList.remove("ellipse");
            description.style.maxWidth = "unset";
            description.style.paddingRight = "0px";
          }
        }
      }
    }

  }

  styleTableCells(cellsToColor);
}

function styleTableCells(cells: { cell: HTMLTableCellElement; key: string }[]) {
  chrome.storage.sync.get("colors", (res) => {
    let storedColors = res.colors as Highlighting[];

    for (let cell of cells) {
      let color = storedColors.find((c) => c.key === cell.key);

      // color not stored already -> generate one
      if (color === undefined) {
        color = { key: cell.key, color: generateRandomColorHex() };
        storedColors.push(color);
      }

      // style cell
      let rgbColor = hexToRgb(color.color);
      if (rgbColor) {
        cell.cell.style.borderRightWidth = "6px";
        cell.cell.style.borderRightColor = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
      }
    }

    chrome.storage.sync.set({ colors: storedColors });
  });
}