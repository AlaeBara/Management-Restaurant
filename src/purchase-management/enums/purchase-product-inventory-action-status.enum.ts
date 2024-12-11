
export enum PurchaseItemStatus {
    // Initial state when product is purchased but not yet in inventory
    PENDING = 'PENDING',
    // Product successfully added to inventory
    COMPLETED = 'COMPLETED',
    // Product could not be added to inventory due to issues
    FAILED = 'FAILED',
    // Product partially added to inventory
    PARTIAL = 'PARTIAL',
    // Product was returned or removed from inventory
    CANCELLED = 'CANCELLED'
}