declare module 'dialogflow-fulfillment'

declare class WebhookClient {
    parameters: { [level: string]: string }
    contexts: WebhookClientContext[]
    add(msg: string): void
    add(card: Card): void
}

declare class WebhookClientContext {
    name: string
    lifespan: number
    parameters: { [level: string]: string }
}

declare class Card {
    title: string
    imageUrl: string
    buttons: CardButton[]
}

declare class CardButton {
    constructor(postback: string, text: string)
    postback: string
    text: string
}