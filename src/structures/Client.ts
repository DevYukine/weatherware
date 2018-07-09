import Weather from './Weather';
import { baseURL } from '../Util/Constants';
import { parseString } from 'xml2js';
import { escape } from 'querystring';
import fetch from 'node-fetch';

export interface DefaultWeatherOptions {
	language?: string;
	degreeType?: string;
}

export interface WeatherOptions extends DefaultWeatherOptions {
	query: string;
}

export class Client {
	private defLanguage = 'en-us';
	private defDegreeType = 'C';

	public constructor(options: DefaultWeatherOptions = {}) {
		if (options.language) this.defLanguage = options.language;
		if (options.degreeType) this.defDegreeType = options.degreeType;
	}

	public async getWeather(options: WeatherOptions): Promise<Weather[]> {
		const res = await fetch(`${baseURL}?src=outlook&weadegreetype=${options.degreeType || this.defDegreeType}&culture=${options.language || this.defLanguage}&weasearchstr=${escape(options.query)}`);

		if (res.ok) {
			const text = await res.text();
			return this.parse(text);
		} else {
			throw new Error(`${res.status} ${res.statusText}`);
		}
	}

	private parse(data: string): Promise<Weather[]> {
		return new Promise((resolve, reject) => {
			parseString(data, (err, result) => {
				if (err) return reject(err);

				if (result.weatherdata.weather.$ && result.weatherdata.weather.$.errormessage) return reject(new Error(result.weatherdata.weather.$.errormessage));

				if (!result || !result.weatherdata || !result.weatherdata.weather) return reject(new Error('failed to parse weather data'));

				if (!(result.weatherdata.weather instanceof Array)) return reject(new Error('missing weather info'));

				const parsedWeather: Array<Weather> = [];
				for (const weather of result.weatherdata.weather) {
					if (typeof weather !== 'object') continue;
					parsedWeather.push(new Weather(weather));
				}

				return resolve(parsedWeather);
			});
		});
	}
}
