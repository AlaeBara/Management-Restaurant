

/**
 * Enum representing the possible statuses of a category
 * ACTIVE - Category is active and available
 * INACTIVE - Category has been manually disabled
 * INSIDE_SCHEDULE - Category is currently within its allowed schedule
 * OUTSIDE_SCHEDULE - Category is currently outside its allowed schedule
 */
export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    INSIDE_SCHEDULE = 'INSIDE_SCHEDULE',
    OUTSIDE_SCHEDULE = 'OUTSIDE_SCHEDULE'
}

