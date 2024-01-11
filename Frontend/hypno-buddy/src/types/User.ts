export type User = {
    _id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    role: 'patient' | 'guardian' | 'therapist' | 'admin';
};
