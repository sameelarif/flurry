exports.generate = () => {
  let data = new Object();

  const depthProbability = Math.random();

  if (depthProbability <= 0.7) {
    data.colorDepth = 24;
  } else if (depthProbability >= 0.05) {
    data.colorDepth = 32;
  } else {
    data.colorDepth = 30;
  }

  const tzProbability = Math.floor(Math.random() * 177);

  if (tzProbability >= 120) {
    data.tz = 140;
  } else if (tzProbability >= 30) {
    data.tz = 240;
  } else if (tzProbability >= 16) {
    data.tz = 320;
  } else {
    data.tz = 420;
  }

  data.width = getRandomInt(1500, 1920);

  data.height = getRandomInt(700, 1080);

  return data;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
