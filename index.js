var fs = require('fs');
var AWS = require('aws-sdk'); 
var SSH = require('simple-ssh');
var waitForPort = require('wait-for-port');

AWS.config.loadFromPath('./.credentials/credentials.json');

Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-d0f506b0', /* required */
  MaxCount: 1, /* required */
  MinCount: 1, /* required */
  Monitoring: {
    Enabled: false /* required */
  },
  InstanceType: 't2.micro',
  SubnetId: 'subnet-3f4ef85b',
  BlockDeviceMappings: [
  {
    Ebs: {
      DeleteOnTermination: true,
      VolumeSize: 500,
      VolumeType: 'sc1'
    },
    DeviceName: '/dev/sdf'
  },
  /* more items */
  ],
  KeyName : "aws_ec2",
  SecurityGroupIds: ['sg-06c4cc61']
};

var pemKey = fs.readFileSync(".credentials/aws_ec2.pem").toString();

var terminateInstances = 
                (function (instanceIds) {
                  var params = {
                    InstanceIds : instanceIds
                  };
                  console.log("Terminating Instances...");
                  ec2.terminateInstances(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     {
                      ec2.waitFor('instanceTerminated', params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else     console.log(data);           // successful response
                      });
                    }
                  });
                });
console.log("Requesting Instances...");
ec2.runInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else   {
    var instanceIds =  data.Instances.map( function (_) {return _.InstanceId});
    var params = {
      InstanceIds : instanceIds
    };
    console.log("Starting Instances...");
    ec2.waitFor('instanceRunning', params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     {
        //$.Reservations[*].Instances[*].PublicIpAddress
        var ipAddresses = data.Reservations.flatMap( function (_) {return _.Instances.map(function (_) {
          return _.PublicIpAddress;
        })});
        console.log("Waiting for Network Availablity...");
        var params = {
          'KeyNames' : ['aws_ec2']
        };
        var ipAddress = ipAddresses.shift();
        var start = new Date();
        waitForPort(ipAddress, 22, { numRetries: 4, retryInterval: 30000 }, function(err) {
          if (err) {
            console.log(err);
            terminateInstances(instanceIds);
          } else {
              var end = new Date();
            console.log("Connecting to Instance...")
            var sshConfig = {
              host: ipAddress,
              user: "ec2-user",
              key: pemKey
            };
            var ssh = new SSH(sshConfig);
            ssh.on('error', function(err) {
              console.log('Oops, something went wrong.');
              console.log(err);
              ssh.end();
              terminateInstances(instanceIds);
            });
            ssh.on('ready', function (){
              console.log(end-start, "Milliseconds")
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
                terminateInstances(instanceIds);
              }
            }).start();
          }
          // .. now we know that (at least for now) my-host.com is
          // listening on port 22
        });
        
      }
    });
  }
});
