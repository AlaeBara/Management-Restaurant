

/**
 * Enum representing the possible statuses of a category
 * ACTIVE - Category is active and available
 * INACTIVE - Category has been manually disabled
 * TIME_RESTRICTED - Category has time-based restrictions
 * OUTSIDE_SCHEDULE - Category is currently outside its allowed schedule
 */
export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    TIME_RESTRICTED = 'TIME_RESTRICTED',
    OUTSIDE_SCHEDULE = 'OUTSIDE_SCHEDULE'
}

