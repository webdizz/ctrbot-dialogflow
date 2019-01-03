import { Request, Response } from 'express'
import { WebhookClient } from 'dialogflow-fulfillment'
import { createLogger } from 'bunyan'

const LOG = createLogger({ name: 'ctrbot/index' })

export function webhookHandler(req: Request, res: Response) {
    if (process.env['DIALOGFLOW_AUTH_TOKEN'] == req.header('DIALOGFLOW_AUTH_TOKEN')) {
        let result = handleWebhookRequest(req, res)
        res.status(200).type("application/json").send(result)
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
    LOG.info({ intent: agent.intent, contexts: agent.contexts, parameters: agent.parameters, session: agent.session })
    return '{"result":"OK"}'
}