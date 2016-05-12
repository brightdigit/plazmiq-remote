var async = require('async');
var Q = require('Q');

var firstCharacter = "!".charCodeAt(0);
var lastCharacter = "~".charCodeAt(0);
var characterRange = lastCharacter - firstCharacter;

function keypairname (callback, a, b) {
  a = a || 255;
  b = b || 255;

  var minimum = Math.min(a, b);
  var maximum = Math.max(a, b);

  var length = Math.floor(minimum + (Math.random() * (maximum - minimum)));

  var deferred = Q.defer();

  async.times(length, function(n, next){
    next(null, String.fromCharCode(firstCharacter + Math.random() * characterRange));
  }, function(err, chars) {
    var data = chars ? chars.join('') : null;
    if (callback) {
      callback(err, data);
    } else {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(data);
      }
    }
  });

  return deferred.promise;
};

module.exports = keypairname;

if (require.main === module) {
  var args = process.argv.slice(2);
  args.unshift(function (error, value) {
    console.log(value);
  })
  keypairname.apply(null, args);
} else {
  console.log('required as a module');
}