/* eslint no-unused-vars : 0 */
import appConfig from './config/app.json';
import mapsConfig from './config/maps.json';

import PixiMapRenderer from './renderer/PixiMapRenderer';

import ElevationMap from './maps/elevationMap';
import TemperatureMap from './maps/temperatureMap';
import PrecipitationMap from './maps/precipitationMap';

console.info('FINISTERRA - 2D World generated by noise functions and renderered with Pixi.js');
const app = new PixiMapRenderer(appConfig.canvas, appConfig.renderer, appConfig.map);

const heightMap = new ElevationMap(appConfig.map, mapsConfig.elevation);

const heatMap = new TemperatureMap(appConfig.map, mapsConfig.temperature, heightMap.map);

const rainMap = new PrecipitationMap(appConfig.map, mapsConfig.precipitation, heightMap.map);

console.info('\n ### RENDER MAPS ###');
// app.renderNoiseMap(heightMap.map, heightMap.theme, heightMap.name);
// app.renderNoiseMap(heatMap.map, heatMap.theme, heatMap.name);
app.renderNoiseMap(rainMap.map, rainMap.theme, rainMap.name);
