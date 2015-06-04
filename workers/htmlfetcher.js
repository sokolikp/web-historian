// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var CronJob = require('cron').CronJob;

new CronJob('* * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
