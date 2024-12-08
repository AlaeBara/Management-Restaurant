export enum FundOperation {
    DEPOSIT = 'deposit',
    PURCHASE = 'purchase',
    TIP = 'tip',
    WITHDRAW = 'withdraw',
    PAYMENT = 'payment',
    REFUND = 'refund',
    EXPENSE = 'expense',
    INCOME = 'income',
    ADJUSTMENT_INCREASE = 'adjustment-increase',
    ADJUSTMENT_DECREASE = 'adjustment-decrease',
    OTHER_INCOME = 'other-income',
    OTHER_EXPENSE = 'other-expense',
    TRANSFER_IN = 'transfer-in',
    TRANSFER_OUT = 'transfer-out',
    CHARGE = 'charge',
    CHARGEBACK = 'chargeback',
    CHARGEBACK_REFUND = 'chargeback-refund',
    CHARGEBACK_CHARGE = 'chargeback-charge',
    TRANSFER = 'transfer',
    TRANSFER_INCREASE = 'transfer-increase', // those should not added to select
    TRANSFER_DECREASE = 'transfer-decrease' // those should not added to select
}

export enum FundOperationStatus {
    PENDING = 'pending',
    APPROVED = 'approved'
}

export const getOperationAction = (operation: FundOperation): 'increase' | 'decrease' | 'both' => {
    switch (operation) {
        case FundOperation.DEPOSIT:
        case FundOperation.TRANSFER_IN:
        case FundOperation.INCOME:
        case FundOperation.CHARGEBACK_REFUND:
        case FundOperation.ADJUSTMENT_INCREASE:
        case FundOperation.OTHER_INCOME:
        case FundOperation.CHARGE:
        case FundOperation.TRANSFER_INCREASE:
            return 'increase';
        case FundOperation.WITHDRAW:
        case FundOperation.TRANSFER_OUT:
        case FundOperation.PAYMENT:
        case FundOperation.EXPENSE:
        case FundOperation.REFUND:
        case FundOperation.CHARGEBACK_CHARGE:
        case FundOperation.ADJUSTMENT_DECREASE:
        case FundOperation.OTHER_EXPENSE:
        case FundOperation.CHARGEBACK:
        case FundOperation.PURCHASE:
        case FundOperation.TIP:
        case FundOperation.TRANSFER_DECREASE:
            return 'decrease';
        case FundOperation.TRANSFER:
            return 'both';
    }
}