import { Color, Highlighting } from './models';

const colors: Highlighting[] = [
	{ key: 'empty', color: 'rgba(84, 181, 75, 0.25)' },
];

enum Route {
	stundenanzeige,
	stundenerfassung,
}

addEventListener('hashchange', (event) => {
	highlighting();
});

function highlighting() {
	const urlRoute = window.location.pathname.substring(1).replace('.php', '');
	var route = undefined;
	if (urlRoute === '' || urlRoute === 'stundenanzeige') {
		route = Route.stundenanzeige;
	}

	if (urlRoute === 'stundenerfassung') {
		route = Route.stundenerfassung;
	}

	if (route === undefined) return;

	const config = getConfigByPage(route);

	const rows = document.getElementsByTagName('tr');

	for (let row of rows) {
		// set reserved days for holidays
		if (
			row.attributes.getNamedItem(config.dataKey)?.value === '' &&
			row.id === config.rowId
		) {
			let tds = row.getElementsByTagName('td');
			for (let td of tds) {
				colorTableCell(td, getProjectColor(colors, 'empty'));
			}

			continue;
		}

		// set project-colors
		if (row.attributes.getNamedItem('data-lfdnr')?.value !== '') {
			let projectCell = row.getElementsByTagName('td')[config.columnIndex];
			if (projectCell !== undefined) {
				let key = projectCell.textContent ?? 'empty';
				projectCell.style.background = getProjectColor(colors, key);
			}
		}
	}
}

function colorTableCell(cell: HTMLTableCellElement, color: Color) {
	cell.style.backgroundColor = color;
}

function getProjectColor(colors: Highlighting[], key: string): Color {
	let storedColor = colors.find((c) => c.key === key);

	if (storedColor !== undefined) {
		return storedColor.color;
	} else {
		let newColor = generateRandomColorRGBA();
		colors.push({ key: key, color: newColor });

		return newColor;
	}
}

function generateRandomColorRGBA(): any {
	var o = Math.round,
		r = Math.random,
		s = 255;
	return (
		'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.4 + ')'
	);
}

function getConfigByPage(route: Route) {
	if (route === Route.stundenanzeige) {
		return {
			dataKey: 'data-lfdnr',
			rowId: ' ',
			columnIndex: 7,
		};
	} else {
		return {
			dataKey: 'data-me',
			rowId: 'me-',
			columnIndex: 6,
		};
	}
}
