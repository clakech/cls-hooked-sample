const express = require('express');
const cls = require('cls-hooked');
const correlationIdBinder = require('./correlationIdBinder');
const nestedService = require('./nestedService');
const logger = require('./logger');

const app = express();

const ns = cls.createNamespace('sample');
app.use(correlationIdBinder(ns));

app.get('/', (req, res) => {
    logger('Here we go !');
    nestedService()
        .then(something => res.send(something));
});

app.listen(3000, () =>
    console.log('Example app listening on port 3000!')
);