import { colorTableCell, getProjectColor } from './highlighting';
import { Highlighting } from './models';

const colors: Highlighting[] = [
	{ key: 'empty', color: 'rgba(84, 181, 75, 0.25)' },
];

const rows = document.getElementsByTagName('tr');

for (let row of rows) {
	// set reserved days for holidays
	if (
		row.attributes.getNamedItem('data-me')?.value === '' &&
		row.id === 'me-'
	) {
		let tds = row.getElementsByTagName('td');
		for (let td of tds) {
			colorTableCell(td, getProjectColor(colors, 'empty'));
		}

		continue;
	}

	// set project-colors
	if (row.attributes.getNamedItem('data-lfdnr')?.value !== '') {
		let projectCell = row.getElementsByTagName('td')[6];
		if (projectCell !== undefined) {
			let key = projectCell.textContent ?? 'empty';
			projectCell.style.background = getProjectColor(colors, key);
		}
	}
}
