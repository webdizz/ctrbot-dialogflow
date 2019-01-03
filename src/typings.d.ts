declare module 'dialogflow-fulfillment'

declare class WebhookClient {
    parameters: string[]
    add(msg: string): void
}