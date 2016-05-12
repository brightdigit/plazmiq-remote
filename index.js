exports.handler = require('./lib/main');

if (!process.env.LAMBDA_TASK_ROOT) { 
  exports.handler(); 
}
