exports.DecryptingAlphaArray = (alphaTokens) => {
  return new Promise(async (resolve) => {
    alphaTokens.map((res) => {
      let ReversedRes = res.split("").reverse().join("");
      if (/^[0-9]+_A_.+$/.test(atob(ReversedRes))) {
        resolve(res);
      }
    });
  });
};

atob = (text) => {
  return Buffer.from(text, "base64").toString("binary");
};
