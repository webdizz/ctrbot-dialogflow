import { Request, Response } from 'express'
import { WebhookClient } from 'dialogflow-fulfillment'

import { Logger } from '@restify-ts/logger'

import { OrderTrackingIntentHandler } from './intents/order-tracking'
import { ProductLookupIntentHandler } from './intents/product-lookup';
import { AddToCartIntentHandler } from './intents/add-to-cart';
import { ViewCartIntentHandler } from './intents/view-cart';

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
    let agent = new WebhookClient({ request: request, response: response });
    LOG.debug({ intent: agent.intent, contexts: agent.contexts }, 'debug message');

    let intentMap = new Map();
    intentMap.set('order-delivery-tracking_order-email', new OrderTrackingIntentHandler(agent, LOG).handleOrderTracking());
    intentMap.set('Search product', new ProductLookupIntentHandler(agent, LOG).handleProductLookup());
    intentMap.set('Add to cart', new AddToCartIntentHandler(agent, LOG).handleAddToCart());
    intentMap.set('View cart', new ViewCartIntentHandler(agent, LOG).handleViewCart());
    
    agent.handleRequest(intentMap);
}
