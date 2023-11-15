export interface User {
    _id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    createdAt: Date;
    updatedAt?: Date; // updatedAt is optional
    role: 'patient' | 'guardian' | 'therapist' | 'admin';

}
