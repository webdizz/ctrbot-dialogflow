declare module 'dialogflow-fulfillment'

declare class WebhookClient {
    parameters: { [level: string]: string }
    contexts: WebhookClientContext[]
    add(msg: string): void
}

declare class WebhookClientContext {
    name: string
    lifespan: number
    parameters: { [level: string]: string }
}