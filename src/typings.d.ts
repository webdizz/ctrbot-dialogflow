declare module 'dialogflow-fulfillment'

declare class WebhookClient {
    parameters: { [level: string]: string }
    contexts: WebhookClientContext[]
    add(msg: string): void
    add(card: Card): void
    clearOutgoingContexts(): void
}

declare class WebhookClientContext {
    name: string
    lifespan: number
    parameters: { [level: string]: string }
}

declare class Card extends RichResponse {
    title: string
    imageUrl: string
    setButton(button: {
        text: string,
        url: string,
    }): Card
}
declare class Suggestion extends RichResponse {
    constructor(suggestion: string | object);

    setReply(reply: string): Suggestion
}

declare class RichResponse {
    setPlatform(platform: string): RichResponse
}

declare module 'dialogflow-fulfillment/src/rich-responses/rich-response' {

    export const PLATFORMS: {
        UNSPECIFIED: 'PLATFORM_UNSPECIFIED',
        FACEBOOK: 'FACEBOOK',
        SLACK: 'SLACK',
        TELEGRAM: 'TELEGRAM',
        KIK: 'KIK',
        SKYPE: 'SKYPE',
        LINE: 'LINE',
        VIBER: 'VIBER',
        ACTIONS_ON_GOOGLE: 'ACTIONS_ON_GOOGLE',
    };
}