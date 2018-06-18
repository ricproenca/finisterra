const classifyFlora = (elevation, temperature, precipitation) => {
  let flora = 'void';
  if (elevation < 0) {
    // ocean biomes
    flora = 'any';

    if (temperature > 0.25) {
      flora = 'any';
    }
    if (temperature < -0.25) {
      flora = 'any';
    }
    if (temperature <= 0.25 && temperature >= -0.25) {
      flora = 'any';
    }
  } else {
    // land floras
    if (temperature < -0.25) {
      // the chilly floras
      if (precipitation > -1.1) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'humid';
      }
      if (precipitation > 0.0) {
        flora = 'humid';
      }
      if (precipitation > 0.25) {
        flora = 'superhumid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    if (temperature > 0.25) {
      // the hot floras
      if (precipitation > -1.1) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'arid';
      }
      if (precipitation > 0.0) {
        flora = 'humid'; // meaning between grass and forest
      }
      if (precipitation > 0.25) {
        flora = 'humid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    if (temperature <= 0.25 && temperature >= -0.25) {
      // the temperate floras
      if (precipitation > -1.1) {
        flora = 'superarid';
      }
      if (precipitation > -0.25) {
        flora = 'arid';
      }
      if (precipitation > 0.0) {
        flora = 'humid';
      }
      if (precipitation > 0.25) {
        flora = 'superhumid';
      }
      if (precipitation > 0.5) {
        flora = 'superhumid';
      }
    }

    //
    if (temperature < -0.55) {
      flora = 'arid';
    }

    if (temperature < -0.66) {
      flora = 'any';
    }
  }
  if (flora === 'void') {
    flora = 'nothing';
    console.log(elevation, temperature, precipitation);
  }
  return flora;
};

export default classifyFlora;

