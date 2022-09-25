import { Highlighting, Route } from "./models";

highlighting();

addEventListener("hashchange", () => {
  highlighting();
});

chrome.storage.onChanged.addListener(() => {
  highlighting();
});

function highlighting() {
  var route = getRoute();

  if (route === undefined) return;

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
      let tds = row.getElementsByTagName("td");
      for (let td of tds) {
        cellsToColor.push({ cell: td, key: "empty" });
      }

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
  }

  colorTableCells(cellsToColor);
}

function colorTableCells(cells: { cell: HTMLTableCellElement; key: string }[]) {
  chrome.storage.sync.get("colors", (res) => {
    let storedColors = res.colors as Highlighting[];

    for (let cell of cells) {
      let color = storedColors.find((c) => c.key === cell.key);

      if (color === undefined) {
        color = { key: cell.key, color: generateRandomColorHex() };
        storedColors.push(color);
      }

      let rgbColor = hexToRgb(color.color);
      if (rgbColor) {
        cell.cell.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${
          rgbColor.b
        }, ${color.key === "empty" ? 0.25 : 0.4})`;
      }
    }

    chrome.storage.sync.set({ colors: storedColors });
  });
}

function getConfigByPage(route: Route) {
  if (route === Route.stundenanzeige) {
    return {
      dataKey: "data-lfdnr",
      classId: " ",
      columnIndex: 7,
    };
  } else {
    return {
      dataKey: "data-me",
      classId: "me-",
      columnIndex: 6,
    };
  }
}

function generateRandomColorHex(): any {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}

function getRoute() {
  const urlRoute = window.location.pathname.substring(1).replace(".php", "");

  if (urlRoute === "" || urlRoute === "stundenanzeige") {
    return Route.stundenanzeige;
  }

  if (urlRoute === "stundenerfassung") {
    return Route.stundenerfassung;
  }
  return undefined;
}

function isNumeric(str: string) {
  if (typeof str != "string") return false; // only process strings!

  /**
   * use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)
   * and ensure strings of whitespace fail
   */
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
