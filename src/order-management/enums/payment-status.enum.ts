
export enum PaymentStatus {
    PENDING = 100,
    PAID = 200,
    FULLY_REFUNDED = 300,
    PARTIALLY_REFUNDED = 301,
    CANCELLED = 400,
}

export function getLabelPaymentStatus(paymentStatus: PaymentStatus): string {
    switch (paymentStatus) {
        case PaymentStatus.PENDING:
            return 'En attente de paiement';
        case PaymentStatus.PAID:
            return 'Payé';
            case PaymentStatus.FULLY_REFUNDED:
                return 'Remboursé totalement';
        case PaymentStatus.PARTIALLY_REFUNDED:
            return 'Remboursé partiellement';
        case PaymentStatus.CANCELLED:
            return 'Annulé';
    }
}

