export class ContextService {

    public static saveCartId(cartId: string, agent: WebhookClient) {
        agent.clearOutgoingContexts();
        agent.setContext({
            name: 'cart-context',
            lifespan: 5,
            parameters: {code: cartId}
        });
    }

    public static getCartIdFromContext(agent: WebhookClient): string | undefined {
        const cartContext = ContextService.getContextByName('cart-context', agent);
        if (cartContext) {
            return cartContext.parameters['code'];
        } else {
            return undefined;
        }
    }

    public static getContextByName(contextName: string, agent: WebhookClient): WebhookClientContext|undefined {
        return agent.contexts.find((context: WebhookClientContext) => context.name === contextName);
    }

}
