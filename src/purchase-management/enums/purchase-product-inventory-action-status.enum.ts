
export enum PurchaseItemStatus {
    // Initial state when product is purchased but not yet in inventory
    PENDING = 'pending',
    // Product successfully added to inventory
    COMPLETED = 'completed',
    // Product could not be added to inventory due to issues
    FAILED = 'failed',
    // Product partially added to inventory
    PARTIAL = 'partial',
    // Product was returned or removed from inventory
    CANCELLED = 'cancelled'
}