
export enum DeliveryType {
    ON_SITE = 100,
    TAKE_AWAY = 200,
    DELIVERY = 300,
}

export function getLabelDeliveryType(deliveryType: DeliveryType): string {
    switch (deliveryType) {
        case DeliveryType.ON_SITE:
            return 'Sur place';
        case DeliveryType.TAKE_AWAY:
            return 'À emporter';
        case DeliveryType.DELIVERY:
            return 'Livraison';
    }
}
