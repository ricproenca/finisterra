import Gradients1D from '../utils/Gradients1D';
import grayscale from './grayscale.json';
import oahu from './oahu.json';
import temperature from './temperature.json';
import precipitation from './precipitation.json';
import biome from './biome.json';

export const grayscaleTheme = new Gradients1D(grayscale);
export const oahuTheme = new Gradients1D(oahu);
export const temperatureTheme = new Gradients1D(temperature);
export const precipitationTheme = new Gradients1D(precipitation);

export const biomeTheme = biome;

export default {
  grayscaleTheme,
  oahuTheme,
  precipitationTheme,
  temperatureTheme,
  biomeTheme,
};
