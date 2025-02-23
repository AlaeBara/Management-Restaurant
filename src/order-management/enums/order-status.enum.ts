export enum OrderStatusHistoryEnum {
    //Created Statuses
    CREATED_BY_WAITER = 100,
    CREATED_BY_CLIENT = 101,
    CREATED_BY_CAISSIER = 102,

    //Sent to preparation Statuses
    SENT_TO_PREPARATION = 200,

    //In preparation Statuses
    IN_PREPARATION_BY_KITCHEN = 300,

    //Ready to serve Statuses
    READY_TO_SERVE = 400,
    READY_TO_DELIVER = 401,

    //Served Statuses
    SERVED_BY_WAITER = 500,
    SERVED_BY_BARMAN = 501,

    // Final Statuses
    COMPLETED = 600,
    CANCELLED = 700,
}

export enum OrderStatus {
    CREATED = 100,
    CONFIRMED = 200,
    IN_PREPARATION = 300,
    READY_TO_SERVE = 400,
    SERVED = 500,
    COMPLETED = 600,
    CANCELLED = 700,
}

export function getLabelOrderStatus(orderStatus: OrderStatus): string {
    switch (orderStatus) {
        case OrderStatus.CREATED:
            return 'En Attente de Confirmation';
        case OrderStatus.CONFIRMED:
            return 'En Attente de Préparation';
        case OrderStatus.IN_PREPARATION:
            return 'En cours de Préparation';
        case OrderStatus.READY_TO_SERVE:
            return 'Prêt à servir';
        case OrderStatus.SERVED:
            return 'Commande servie';
        case OrderStatus.COMPLETED:
            return 'Commande terminée';
        case OrderStatus.CANCELLED:
            return 'Commande annulée';
    }
}

