var AWS = require('aws-sdk'); 

AWS.config.loadFromPath('./.credentials/credentials.json');

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-d0f506b0', /* required */
  MaxCount: 1, /* required */
  MinCount: 1, /* required */
  Monitoring: {
    Enabled: false /* required */
  },
  InstanceType: 't2.micro',
  NetworkInterfaces: [
    {
      DeviceIndex: 0,
      SubnetId: 'subnet-3f4ef85b'
    },
    /* more items */
  ],
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
  KeyName : "aws_ec2"
};

ec2.runInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
