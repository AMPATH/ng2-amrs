var cache = require('memory-cache');
var bcrypt = require('bcrypt');
var moduleDefinition = {
  getFromToCache: getFromToCache,
  saveToCache: saveToCache,
  encriptKey: encriptKey,
  removeFromCache: removeFromCache
};

function getFromToCache(key) {
  return cache.get(key);
}

function saveToCache(key, value) {
  cache.put(key, value, 900000);
}

function encriptKey(key, success, error) {
  var saltRounds = 10;
  bcrypt.hash(key, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    if (err) {
      error(err);
    }
    success('key'+hash+'key');
  });
}

function removeFromCache(key) {
  cache.del(key);
}
module.exports = moduleDefinition;
