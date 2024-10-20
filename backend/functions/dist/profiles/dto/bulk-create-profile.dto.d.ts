export declare class CreateProfileDto {
    name: string;
    address?: string;
    telephone?: string;
    email: string;
    rank?: number;
    image?: string;
    description?: string;
    specialization?: string;
    geolocation?: string;
    stars?: number;
    opinions?: number;
    website?: string;
    city: string;
    company: string;
}
export declare class BulkCreateProfileDto {
    profiles: CreateProfileDto[];
}
