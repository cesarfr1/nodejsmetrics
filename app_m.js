const { start } = require('@splunk/otel');
const opentelemetry = require('@opentelemetry/api');

start({
     metrics: {
     runtimeMetricsEnabled: true,
     }
});

const express = require('express');
const PORT = parseInt(process.env.PORT || '8080');
const app = express();
const { metrics } = require('@opentelemetry/api');
const meter = metrics.getMeter('my-meter');
const counter = meter.createCounter('clicks');



var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'rolldice'});


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get('/rolldice', (req, res) => {
    rand=getRandomNumber(1, 6).toString()
    res.send(rand);
    counter.add(1);
    // console.log(rand)
    log.info("dice result:" + rand)

});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

