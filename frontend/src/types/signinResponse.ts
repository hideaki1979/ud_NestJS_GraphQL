export type SignInResponse = {
    signIn: {
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
};