export enum MovementType {
    ALLOCATION_PRODUCT = 'allocation_product',
    WASTAGE = 'wastage',
    SUPPLIER_RETURN = 'supplier_return',
    TRANSFER = 'transfert',
    ADJUSTMENT = 'adjustment',
    INVENTORY_COUNT = 'inventory_count',
    INVENTORY_INITIAL = 'inventory_initial',
}

export const getMovementAction = (type: MovementType): 'increase' | 'decrease' | 'both' => {
    switch (type) {
        case MovementType.INVENTORY_INITIAL:
            return 'increase';
        case MovementType.ALLOCATION_PRODUCT:
        case MovementType.WASTAGE:
        case MovementType.SUPPLIER_RETURN:
            return 'decrease';
        case MovementType.TRANSFER:
        case MovementType.ADJUSTMENT:
        case MovementType.INVENTORY_COUNT:
            return 'both';
    }
}
