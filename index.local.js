'use strict'


const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    webhookRouter = express.Router(),
    cors = require("cors"),
    path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const webhook = require('./build/src/index')

webhookRouter.post('*', function (req, res) {
    webhook.webhookHandler(req, res)
});

app.use('/webhookHandler', webhookRouter);

app.listen(1337, function () {
    console.log('Webhook is  listening...');
});