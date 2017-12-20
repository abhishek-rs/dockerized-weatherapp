const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');
const appid = require('../keys.js');

const appId = process.env.APPID || appid;
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const defaultCity = process.env.DEFAULT_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (lat, lon) => {
  const endpoint = lat && lon ? `${mapURI}/weather?lat=${lat}&lon=${lon}&appid=${appId}&` : `${mapURI}/weather?q=${defaultCity}&appid=${appId}&`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

const fetchForecast = async (lat, lon) => {
  const endpoint = lat && lon ? `${mapURI}/forecast?lat=${lat}&lon=${lon}&appid=${appId}&` : `${mapURI}/forecast?q=${defaultCity}&appid=${appId}&`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const weatherData = ctx.request.query ? await fetchWeather(ctx.request.query.lat, ctx.request.query.lon) : await fetchWeather();
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

router.get('/api/forecast', async ctx => {
  const forecastData = ctx.request.query ? await fetchForecast(ctx.request.query.lat, ctx.request.query.lon) : await fetchForecast();
  ctx.type = 'application/json; charset=utf-8';
  var res = [];
  if (forecastData.list) {
    res = forecastData.list.reduce((res, forecast) => {
      let forecastDate = forecast.dt_txt;
      let weather = forecast.weather[0];
      res.push({ date: forecastDate, weather: weather, });
      return res;
    }, []);
  }
  ctx.body = forecastData.list ? res : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
