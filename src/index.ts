import { Request, Response } from 'express'
import { WebhookClient } from 'dialogflow-fulfillment'

import { Logger } from '@restify-ts/logger';

let LOG = new Logger({
    name: 'ctrbot/index',
    level: process.env['LOGGING_LEVEL'] || 'info',
    streams: [
        {
            stream: process.stdout,
            level: 'trace'
        }
    ]
});

export function webhookHandler(req: Request, res: Response) {
    if (process.env['DIALOGFLOW_AUTH_TOKEN'] == req.header('DIALOGFLOW_AUTH_TOKEN')) {
        handleWebhookRequest(req, res)
    } else {
        res.status(404).send('No such page.')
    }
}

/**
 * Handles Webhook request
 * @param request 
 * @param response 
 */
function handleWebhookRequest(request: Request, response: Response) {
    let agent = new WebhookClient({ request: request, response: response })
    LOG.debug({ intent: agent.intent, contexts: agent.contexts, parameters: agent.parameters, session: agent.session }, 'debug message')

    let intentMap = new Map()
    intentMap.set('order-delivery-tracking_order-number', handleOrderTracking)

    agent.handleRequest(intentMap)
}

function handleOrderTracking(agent: WebhookClient) {
    let orderNumber = agent.parameters['order-number']
    agent.add(`Hello, your order ${orderNumber} will arrive....`)
}