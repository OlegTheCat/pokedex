Config = require('./Config');
_ = require('underscore');

function encodeParams(queryParams) {
  // Yeah, naive implementation
  return _.map(queryParams, function(v, k) { return String(k) + "=" + String(v); })
          .join("&");
}

function buildUrl(endpoint, resourceName, queryParams, resourceId) {
  var resourceUrl = endpoint;

  if (resourceName && !_.isEmpty(String(resourceName))) {
    resourceUrl = resourceUrl + "/" + resourceName;
  }

  if (resourceId && !_.isEmpty(String(resourceId))) {
    resourceUrl = resourceUrl + "/" + resourceId;
  }

  if (queryParams && !_.isEmpty(queryParams)) {
    resourceUrl = resourceUrl + '/?' + encodeParams(queryParams);
  }

  return resourceUrl;
}

var buildPokeapiUrl = _.partial(buildUrl, Config.API_ENDPOINT);

module.exports = {
  buildPokemonUrl: _.partial(buildPokeapiUrl,
                             Config.POKEMON_RESOURCE),

  buildTypeUrl: _.partial(buildPokeapiUrl,
                          Config.TYPE_RESOURCE),

  buildImgUrl: _.compose(
    function(url) {
      return url + ".png";
    },
    _.partial(buildUrl, Config.IMG_ENDPOINT, null, null))
};
