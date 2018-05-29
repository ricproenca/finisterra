/* eslint no-unused-vars : 0 */
import appConfig from './config/app.json';
import mapsConfig from './config/maps.json';

import PixiMapRenderer from './renderer/PixiMapRenderer';

import ElevationMap from './maps/elevationMap';
import TemperatureMap from './maps/temperatureMap';
import PrecipitationMap from './maps/precipitationMap';
import BiomeMap from './maps/biomeMap';
import FloraMap from './maps/floraMap';
import SlopeMap from './maps/slopeMap';

import Eroder from './effects/eroder';

console.info('FINISTERRA - 2D World generated by noise functions and renderered with Pixi.js');
const app = new PixiMapRenderer(appConfig.canvas, appConfig.renderer, appConfig.map);

const heightMap = new ElevationMap(appConfig.map, mapsConfig.elevation);

const heatMap = new TemperatureMap(appConfig.map, mapsConfig.temperature, heightMap.map);

const rainMap = new PrecipitationMap(appConfig.map, mapsConfig.precipitation, heightMap.map);

const biomeMap = new BiomeMap(appConfig.map, heightMap.map, heatMap.map, rainMap.map);

const floraMap = new FloraMap(appConfig.map, heightMap.map, heatMap.map, rainMap.map);

// const slopeMap = new SlopeMap(appConfig.map, heightMap.map);
// const eroder = new Eroder(appConfig.map, slopeMap, heightMap.map);
// const rivers = eroder.applyErosion();

console.info('\n ### RENDER MAPS ###');
// app.renderNoiseMap(heightMap.map, heightMap.theme, heightMap.name);
// app.renderNoiseMap(heatMap.map, heatMap.theme, heatMap.name);
// app.renderNoiseMap(rainMap.map, rainMap.theme, rainMap.name);
app.renderFlatMap(biomeMap.map, biomeMap.theme, biomeMap.name);
app.renderFlatMap(floraMap.map, floraMap.theme, floraMap.name);

// if (typeof rivers !== 'undefined') {
//   app.renderRiverMap(rivers, 0x326eff, 'RIVERS MAP');
// }
