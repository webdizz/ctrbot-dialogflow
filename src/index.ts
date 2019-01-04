import { Request, Response } from 'express'
import { WebhookClient } from 'dialogflow-fulfillment'

import { Logger } from '@restify-ts/logger'

import * as request from 'request-promise-native'

const LOG = new Logger({
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
    LOG.debug({ intent: agent.intent, contexts: agent.contexts }, 'debug message')

    let intentMap = new Map()
    intentMap.set('order-delivery-tracking_order-email', handleOrderTracking)

    agent.handleRequest(intentMap)
}

async function handleOrderTracking(agent: WebhookClient) {
    let intentContextParams = agent.contexts[0].parameters
    let orderNumber = intentContextParams['order-number']
    let email = intentContextParams['order-email']

    const ENDPOINT_ORDER_DETAILS = process.env['ENDPOINT_ORDER_DETAILS'] as string
    let options = {
        uri: ENDPOINT_ORDER_DETAILS,
        body: {
            orderId: orderNumber,
            email: email
        },
        json: true
    }
    const response = await request.post(options)

    agent.add(`Hello, your order '${orderNumber}' status is '${response.status}' and will arrive at ${response.products['order.status.inprogress'][0].eta}`)
}