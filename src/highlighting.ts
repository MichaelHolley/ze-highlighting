import { Color, Highlighting } from './models';

export function colorTableCell(cell: HTMLTableCellElement, color: Color) {
	cell.style.backgroundColor = color;
}

export function getProjectColor(colors: Highlighting[], key: string): Color {
	let storedColor = colors.find((c) => c.key === key);

	if (storedColor !== undefined) {
		return storedColor.color;
	} else {
		let newColor = generateRandomColorRGBA();
		colors.push({ key: key, color: newColor });

		return newColor;
	}
}

export function generateRandomColorRGBA(): any {
	var o = Math.round,
		r = Math.random,
		s = 255;
	return (
		'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.4 + ')'
	);
}
