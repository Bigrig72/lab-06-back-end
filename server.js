'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

app.use(express.static('./city-explorer-client'));

app.get('/home', function(req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/location', (req, res) => {
  const locationData = searchToLatLong(req.query.data);
  res.send(locationData);
});

function Location(data) {
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}

app.get('/weather', (req, res) => {
  const weatherData = searchWeather(req.query.data);
  res.send(weatherData);
});

function Weather(data) {
  this.forecast = data.summary;
  this.current_time = data.time;
}

function searchWeather(query) {
  const weatherData = require('./data/weather.json');
  const weather = new Weather(weatherData.currently);
  weather.search_query = query;
  return weather;
}
