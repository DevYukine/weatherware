# WeebTS
Typescript module to get information from the Microsoft weather API, usable in both TS and JS.

Example usage:

Typescript:
```Typescript
import { Client } from 'weatherware';

const client: Client = new Client();

client.getWeather({ query: 'city name or zipcode' })
	.then(console.log)
	.catch(console.error);
```

Javascript:
```js
const { Client } = require('weatherware');

const client = new Client({ language: 'default Language (can be overriden in the getWeather method)', degreeType: 'default degreeType (can be overriden in the getWeather method)' });

client.getWeather({ query: 'city name or zipcode'})
	.then(console.log)
	.catch(console.error);
```