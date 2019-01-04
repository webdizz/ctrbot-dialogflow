declare module 'dialogflow-fulfillment'

declare class WebhookClient {
    parameters: { [level: string]: string };
    add(msg: string): void
}