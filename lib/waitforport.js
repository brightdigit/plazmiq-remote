var waitForPort = require('wait-for-port');
var Q = require('q');

module.exports = function (ipAddress, options) {
  var deferred = Q.defer();
  waitForPort(ipAddress, 22, options, function(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(true);
    }
  });

  return deferred.promise;
};