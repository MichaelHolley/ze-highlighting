import { Highlighting, Route } from "./models";

highlighting();

addEventListener("hashchange", () => {
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
      (row.attributes.getNamedItem(config.dataKey)?.value === "" ||
        row.attributes.getNamedItem(config.dataKey)?.value === undefined) &&
      row[route === Route.stundenanzeige ? "className" : "id"] ===
        config.classId
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
        color = { key: cell.key, color: generateRandomColorRGBA() };
        storedColors.push(color);
      }

      cell.cell.style.backgroundColor = color.color;
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

function generateRandomColorRGBA(): any {
  var o = Math.round,
    r = Math.random,
    s = 255;

  return (
    "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + 0.4 + ")"
  );
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
