import Weather from './structures/Weather';
import { baseURL } from './Util/Constants';
import { parseString } from 'xml2js';
import { escape } from 'querystring';
import { get } from 'snekfetch';

export interface DefaultWeatherOptions {
	language?: string,
	degreeType?: string
}

export interface WeatherOptions extends DefaultWeatherOptions {
	query: string
}

export class Client {
	private defLanguage: string = 'en-us';
	private defDegreeType: string = 'C';

	public constructor(options: DefaultWeatherOptions = {}) {
		if(options.language) this.defLanguage = options.language;
		if(options.degreeType) this.defDegreeType = options.degreeType;
	}

	public async getWeather(options: WeatherOptions): Promise<Weather[]> {
		const { text } = await get(baseURL)
			.query('src', 'outlook')
			.query('weadegreetype', options.degreeType || this.defDegreeType)
			.query('culture', options.language || this.defLanguage)
			.query('weasearchstr', escape(options.query))

		return this.parse(text);
	}

	private parse(data: string): Promise<Weather[]> {
		return new Promise((resolve, reject) => {
			parseString(data, (err, result) => {
				if (err) return reject(err);

				if (result.weatherdata.weather.$ && result.weatherdata.weather.$.errormessage) return reject(new Error(result.weatherdata.weather.$.errormessage))
				
				if(!result || !result.weatherdata || !result.weatherdata.weather) return reject(new Error('failed to parse weather data'));
				
				if(!(result.weatherdata.weather instanceof Array)) return reject(new Error('missing weather info'));

				const parsedWeather: Array<Weather> = [];
				for (const weather of result.weatherdata.weather) {
					if (typeof weather !== 'object') continue;
					parsedWeather.push(new Weather(weather))
				}

				return resolve(parsedWeather);
			})
		})
	}
}
