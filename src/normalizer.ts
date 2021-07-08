import { normalizeSpelling } from './libs';

export type addressDict = {
	[pref: string]: string[]
}
interface CachedRegex {
	key: string
	regex: RegExp
}

export default class Normalizer {
	dict: addressDict;
	endpoint: string;
	// dictから読み込んだデータで構成した正規表現を保存する
	regexes: {
		pref: CachedRegex[],
		city: { [pref: string]: CachedRegex[] },
		town: { [city: string]: CachedRegex[] }
	}
	constructor(_dict: addressDict, endpoint: string) {
		this.dict = _dict;
		this.endpoint = endpoint;
		this.regexes = this.prepareRegexes(_dict);
		console.log(this.regexes);
	}

	/**
	 * dictから正規表現を構成する
	 * @param dict Geolonia/japanese-addressesから読み込んだデータ
	 */
	private prepareRegexes = (dict: addressDict) => {
		// 都道府県について
		const prefs = Object.keys(dict);
		const prefectureRegexes = prefs.map(pref => {
			const prefWithoutSuffix = pref.replace(/(都|道|府|県)$/, '');
			const regex = new RegExp(`^${prefWithoutSuffix}(都|道|府|県)`);
			return {
				key: pref,
				regex: regex
			}
		});
		// 市町村について
		let cityRegexes: { [pref: string]: CachedRegex[] } = {};
		for (const [pref, cities] of Object.entries(dict)) {
			cities.sort((a: string, b: string) => {
				return b.length - a.length;
			});
			const regexes = cities.map(city => {
				// 末尾が「町」「村」のときはその前の郡名に「郡」が省略されている可能性を考慮
				const expression = city.match(/(町|村)$/) ? city.replace(/(.+?)郡/, '($1郡)?') : city;
				// 表記のゆれを補正
				const regex = normalizeSpelling(expression);
				return {
					key: city,
					regex: regex
				}
			});
			cityRegexes[pref] = regexes;
		}
		// 街について
		// 事前にすべて読み込むのでは時間がかかる
		// 一件一件ずつ処理

		return {
			pref: prefectureRegexes,
			city: cityRegexes,
			town: {}
		}
	}
}
