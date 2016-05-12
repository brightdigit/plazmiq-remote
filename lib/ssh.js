var SSH = require('simple-ssh');
var Q = require('q');

                // sudo mkswap /dev/xvdf
                // sudo swapon /dev/xvdf

                // yum -y install git
                // curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
                // source ~/.bashrc

                // install ssh keys
                // install credentials

                // git clone
                // 
                
module.exports = function (config) {
  var deferred = Q.defer();

  var end = new Date();
  
  var ssh = new SSH(config);
  ssh.on('error', function(err) {
    console.log('Oops, something went wrong.');
    console.log(err);
    ssh.end();
    return deferred.reject(err);
  });
  ssh.on('ready', function (){
    end = new Date();
  });
  ssh.exec('pwd', {
    out: function(stdout) {
      console.log(stdout);
    },
    exit: function(code, stdout, stderr) {
      // sudo mkswap /dev/xvdf
      // sudo swapon /dev/xvdf

      // yum -y install git
      // curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
      // source ~/.bashrc

      // install ssh keys
      // install credentials

      // git clone
      // 
      console.log(stdout);
      console.log(stderr);
      console.log(code);
      console.log("done");
      ssh.end();
      return deferred.resolve(end);
    }
  }).start();

  return deferred.promise;
};