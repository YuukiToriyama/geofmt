import axios from 'axios';
import Normalizer, { addressDict } from './normalizer';


class Geofmt {
	static async normalizer(_endpoint?: string) {
		const endpoint = _endpoint || "https://geolonia.github.io/japanese-addresses/api/ja.json";
		const response = await axios.get<addressDict>(endpoint);
		return new Normalizer(response.data);
	}
}

const hoge = Geofmt.normalizer();