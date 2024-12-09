export enum FundOperation {
    DEPOSIT = 'deposit', // Tracks funds added to an account or wallet.
    TIP = 'tip', // Tracks gratuities given, typically to service staff.
    WITHDRAW = 'withdraw', // Represents funds being taken out (e.g., cash withdrawal).
    PAYMENT = 'payment', // General term for sending money, typically for goods or services.
    REFUND = 'refund', // Tracks money returned to the user.
    EXPENSE = 'expense', // Represents costs incurred, typically not tied to purchases or tipping.
    INCOME = 'income', // Tracks revenue or earnings.
    ADJUSTMENT = 'adjustment', // Represents corrections (e.g., manual updates to balances).
    PENALTY = 'penalty', // To deter or punish non-compliance.	
    CHARGE = 'charge', // To compensate for a service or usage.
    TRANSFER = 'transfer' // Tracks the movement of funds between accounts or entities.
}

export enum FundOperationStatus {
    PENDING = 'pending',
    APPROVED = 'approved'
}

export const getOperationAction = (operation: FundOperation): 'increase' | 'decrease' | 'both' => {
    switch (operation) {
        case FundOperation.DEPOSIT:
        case FundOperation.INCOME:
        case FundOperation.CHARGE:
            return 'increase';
        case FundOperation.WITHDRAW:
        case FundOperation.PAYMENT:
        case FundOperation.EXPENSE:
        case FundOperation.TIP:
            return 'decrease';
        case FundOperation.TRANSFER:
        case FundOperation.ADJUSTMENT:
        case FundOperation.REFUND:
            return 'both';
    }
}