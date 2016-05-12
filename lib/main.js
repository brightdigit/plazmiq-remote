var AWS = require('aws-sdk'); 
var Q = require('Q');

AWS.config.setPromisesDependency(Q.Promise);

module.exports = function (event, context, callback) {
  var ipAddress;
  var key;
  var instanceIds;
  var start;
  var keyName;

  if (!process.env.LAMBDA_TASK_ROOT) { 
    
    AWS.config.loadFromPath(__dirname + '/../.credentials/credentials.json');
  }

  var ec2 = new AWS.EC2();
  var ec2RequestParams = require("../ec2Request.json");
  //var pemKey = fs.readFileSync("../.credentials/aws_ec2.pem").toString();
  require('./keypairname')()
  .then(
    function (value) {
      console.log("Creating Key Pair...");
      keyName = value;
      return  ec2.createKeyPair({"KeyName" : value}).promise();
    }
  )
  .then(
    function (data) {
      console.log("Requesting Instances...");
      key = data.KeyMaterial;
      ec2RequestParams.KeyName = data.KeyName;
      return ec2.runInstances(ec2RequestParams).promise();
    }
  )
  .then(
    function (data) {
      instanceIds =  data.Instances.map( function (_) {return _.InstanceId});
      console.log("Starting Instances...");
      return ec2.waitFor('instanceRunning', {
        InstanceIds : instanceIds
      }).promise();
    }
  )
  .then(
    function (data) {
      var index, jndex;
      for (index = 0; index < data.Reservations.length && !ipAddress; ++index) {
        for (jndex = 0; jndex < data.Reservations[index].Instances.length && !ipAddress; ++jndex) {
          ipAddress = data.Reservations[index].Instances[jndex].PublicIpAddress;
        }
      } 
      console.log("Waiting for Network Availablity...");
      
      start = new Date();
      return require('./waitforport')(ipAddress, { numRetries: 4, retryInterval: 30000 });
    }
  ).then(
    function () {
      console.log("Connecting to Instance...");
      return require('./ssh')({host : ipAddress, key: key, user: "ec2-user"});
    }
  ).then(
    function (end) {
      console.log("Shutting Down Instances...");
      return ec2.terminateInstances({
        InstanceIds : instanceIds
      }).promise();
    }
  ).then(
    function () {
      console.log("Deleting Key Pair...");
      return ec2.deleteKeyPair({"KeyName" : keyName}).promise();
    }
  ).then(
    function () {
      console.log("Terminating Instances...");
      return ec2.waitFor('instanceTerminated', {
        InstanceIds : instanceIds
      }).promise();
    }
  ).catch (
    function (error) {
      console.log(error);
    }
  );
};