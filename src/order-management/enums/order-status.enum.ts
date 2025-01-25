export enum OrderStatusHistory {
    //Created Statuses
    CREATED_BY_WAITER = 100,
    CREATED_BY_CLIENT = 101,
    CREATED_BY_CAISSIER = 102,

    //Sent to preparation Statuses
    SENT_TO_PREPARATION = 200,

    //In preparation Statuses
    IN_PREPARATION = 300,

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