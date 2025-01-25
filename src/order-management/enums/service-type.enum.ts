
export enum ServiceType {
    SERVICE_A_LA_FOIS = 100,
    SERVICE_GUIDE = 200,
}

export function getLabelServiceType(serviceType: ServiceType): string {
    switch (serviceType) {
        case ServiceType.SERVICE_A_LA_FOIS:
            return 'Service à la fois';
        case ServiceType.SERVICE_GUIDE:
            return 'Service guidé';
    }
}
