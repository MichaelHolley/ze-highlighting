import { type Highlighting, Route } from './models';
import { initTweaks } from './tweaks';
import {
  generateRandomColorHex,
  getConfigByPage,
  getRoute,
  hexToRgb,
  isNumeric
} from './utils';

highlighting();
initTweaks();

addEventListener('hashchange', () => {
  highlighting();
  initTweaks();
});

chrome.storage.onChanged.addListener(() => {
  highlighting();
});

function highlighting() {
  const route = getRoute();

  if (route === undefined) {
    return;
  }

  const config = getConfigByPage(route);

  const rows = document.getElementsByTagName('tr');
  const cellsToColor: { cell: HTMLTableCellElement; key: string }[] = [];

  for (const row of rows) {
    // removing the ellipsis on descriptions
    if (config.descriptionColumIndex) {
      const descriptionCell =
        row.getElementsByTagName('td')[config.descriptionColumIndex];

      if (descriptionCell) {
        const readmore = descriptionCell.querySelector('.readmore');
        if (readmore != null) {
          // remove collapse button
          descriptionCell.querySelector('.readmore-action')?.remove();

          // remove ellipsis from description
          const description: HTMLDivElement = readmore
            .children[0] as HTMLDivElement;
          if (description !== undefined) {
            description.classList.remove('ellipse');
            description.style.maxWidth = 'unset';
            description.style.paddingRight = '0px';
          }
        }
      }
    }

    // set reserved days for holidays
    if (
      ((row.attributes.getNamedItem(config.dataKey)?.value === '' ||
        row.attributes.getNamedItem(config.dataKey)?.value === undefined) &&
        row[route === Route.stundenanzeige ? 'className' : 'id'] ===
          config.classId) ||
      row?.cells[config.columnIndex + 1]?.innerText
        ?.toLowerCase()
        .includes('urlaub')
    ) {
      const cell = row.getElementsByTagName('td')[config.columnIndex];
      cellsToColor.push({ cell: cell, key: 'empty' });
      continue;
    }

    // set project-colors
    if (row.attributes.getNamedItem(config.dataKey)?.value !== '') {
      const projectCell = row.getElementsByTagName('td')[config.columnIndex];

      if (projectCell) {
        let key = projectCell.innerText.trim() ?? 'empty';

        if (key === 'Projekt intern') {
          cellsToColor.push({ cell: projectCell, key: key });
          continue;
        }

        // Stundenanzeige uses 'Projekt' prefix
        if (route === Route.stundenanzeige && key.startsWith('Projekt')) {
          key = key.substring('Projekt'.length).trim();
          cellsToColor.push({ cell: projectCell, key: key });
          continue;
        }

        // stundenerfassung uses 'Projekt/Auftrag' prefix
        if (
          route === Route.stundenerfassung &&
          key.startsWith('Projekt/Auftrag')
        ) {
          key = key.substring('Projekt/Auftrag'.length).trim();
          cellsToColor.push({ cell: projectCell, key: key });
          continue;
        }

        // empty value like holidays or sick leave
        if (key === '' || !key) {
          key = 'empty';
          cellsToColor.push({ cell: projectCell, key: key });
          continue;
        }

        if (
          isNumeric(key) ||
          key.startsWith('Kunde') ||
          key.includes('Urlaub') ||
          key.match(/[0-9]+: /)
        ) {
        }
      }
    }
  }

  styleTableCells(cellsToColor);
}

function styleTableCells(cells: { cell: HTMLTableCellElement; key: string }[]) {
  chrome.storage.sync.get('colors', (res) => {
    const storedColors = res.colors as Highlighting[];

    for (const cell of cells) {
      let color = storedColors.find((c) => c.key === cell.key);

      // color not stored already -> generate one
      if (color === undefined) {
        color = { key: cell.key, color: generateRandomColorHex() };
        storedColors.push(color);
      }

      // style cell
      const rgbColor = hexToRgb(color.color);
      if (rgbColor) {
        cell.cell.style.borderRightWidth = '6px';
        cell.cell.style.borderRightColor = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
      }
    }

    chrome.storage.sync.set({ colors: storedColors });
  });
}
