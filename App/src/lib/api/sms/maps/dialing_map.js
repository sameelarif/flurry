const { countryMap } = require("../../../db/country_list");

exports.map = (country) => {
  return countryMap.filter((_country) => {
    return _country.name == country;
  })[0].phone_code;
};

exports.iso2 = (country) => {
  return countryMap.filter((_country) => {
    return _country.name == country;
  })[0].iso2;
};
