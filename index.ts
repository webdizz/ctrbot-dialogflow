import { Request, Response } from 'express'
import { WebhookClient } from 'dialogflow-fulfillment'
import { createLogger } from 'bunyan'

export function webhookHandler(req: Request, res: Response) {

    const LOG = createLogger({ name: 'ctrbot/index' })
    LOG.info(req)
    LOG.info(process.env.DIALOGFLOW_AUTH_TOKEN)

    let agent = new WebhookClient({ request: req, response: res })
    LOG.info(agent.intent, agent.contexts, agent.parameters, agent.session)
    res.status(200).type("application/json").send('{"result":"OK"}')
}