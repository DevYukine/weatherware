export interface Current {
	temperature: string,
	skycode: string,
	skytext: string,
	date: string,
	observationtime: string,
	observationpoint: string,
	feelslike: string,
	humidity: string,
	winddisplay: string,
	day: string,
	shortday: string,
	windspeed: string,
	imageUrl: string
}

export interface forecast {
	low: string,
	high: string,
	skycodeday: string,
	skytextday: string,
	date: string,
	day: string,
	shortday: string,
	precip: string
}

export default class Weather {
	public name: string
	public zipcode: string
	public lat: string
	public long: string
	public timezone: string
	public alert: string
	public degreetype: string
	public imagerelativeurl: string
	public current: Current | null = null;
	public forecast: forecast[] = [];

	public constructor(data: any) {
		const realData = data.$;

		this.name = realData.weatherlocationname;
		this.zipcode = realData.zipcode;
		this.lat = realData.lat;
		this.long = realData.long;
		this.timezone = realData.timezone;
		this.alert = realData.alert;
		this.degreetype = realData.degreetype;
		this.imagerelativeurl = realData.imagerelativeurl;

		if (data.current instanceof Array && data.current.length > 0) {
			if (typeof data.current[0].$ === 'object') {
			  this.current = data.current[0].$ as Current;
			  this.current.imageUrl = `${this.imagerelativeurl}law/${this.current.skycode}.gif`;
			}
		}
		
		if (data.forecast instanceof Array) {
			for (const forecast of data.forecast) {
				if (typeof forecast === 'object') this.forecast.push(forecast);
			}
		}
	}
}