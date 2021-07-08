export const normalizeSpelling = (str: string): RegExp => {
	const expression = str.replace(/通り|とおり/g, '(通り|とおり)')
		.replace(/埠頭|ふ頭/g, '(埠頭|ふ頭)')
		.replace(/[之ノの]/g, '[之ノの]')
		.replace(/[ヶケが]/g, '[ヶケが]')
		.replace(/[ヵカか力]/g, '[ヵカか力]')
		.replace(/[ッツっつ]/g, '[ッツっつ]');

	return new RegExp(expression);
}