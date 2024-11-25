export enum MovementType {
    //PURCHASE = 'purchase',
    ALLOCATION_PRODUCT = 'allocation_product',
    WASTAGE = 'wastage',
    CUSTOMER_RETURN = 'customer_return',
    SUPPLIER_RETURN = 'supplier_return',
    TRANSFER_IN = 'transfer_in',
    TRANSFER_OUT = 'transfer_out',
    SALE = 'sale',
    ADJUSTMENT_INCREASE = 'adjustment_increase',
    ADJUSTMENT_DECREASE = 'adjustment_decrease',
    INVENTORY_COUNT_INCREASE = 'inventory_count_increase',
    INVENTORY_COUNT_DECREASE = 'inventory_count_decrease',
    INVENTORY_INITIAL = 'inventory_initial',
}

export const getMovementAction = (type: MovementType): 'increase' | 'decrease' => {
    switch (type) {
        // case MovementType.PURCHASE:
        case MovementType.CUSTOMER_RETURN:
        case MovementType.TRANSFER_IN:
        case MovementType.ADJUSTMENT_INCREASE:
        case MovementType.INVENTORY_COUNT_INCREASE:
        case MovementType.INVENTORY_INITIAL:
            return 'increase';

        case MovementType.ALLOCATION_PRODUCT:
        case MovementType.WASTAGE:
        case MovementType.SUPPLIER_RETURN:
        case MovementType.TRANSFER_OUT:
        case MovementType.SALE:
        case MovementType.ADJUSTMENT_DECREASE:
        case MovementType.INVENTORY_COUNT_DECREASE:
            return 'decrease';
    }
}
