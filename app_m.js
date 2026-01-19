const { start } = require('@splunk/otel');
const opentelemetry = require('@opentelemetry/api');
const sc = require("@opentelemetry/semantic-conventions");
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
const requestDurationHistogram = meter.createHistogram("cf.http.server.request.duration", {  
        unit: "s",  
      advice: {  
         explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10],  
      },  
      description: "Duration of HTTP server requests",  
   });

const requestsCounter = meter.createCounter("cf.http.server.request.total", {  
      description: "Total number of requests",  
      unit: "{request}",  
      valueType: opentelemetry.ValueType.INT,  
   });


var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'rolldice'});


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get('/rolldice', (req, res) => {
    const startTime = new Date().getTime();
    rand=getRandomNumber(1, 6).toString()
    res.send(rand);
    counter.add(1);
    // console.log(rand)
    log.info("dice result:" + rand)
    const endTime = new Date().getTime();
    const execTime = (endTime - startTime) / 1000

    requestDurationHistogram.record(execTime, {
      [sc.ATTR_HTTP_REQUEST_METHOD]: 'GET',
      [sc.ATTR_HTTP_RESPONSE_STATUS_CODE]: '200',
      [sc.ATTR_URL_SCHEME]: 'https',
    })
    requestsCounter.add(1);

});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});