import { z } from 'zod';

export const UserSchema = z.object({
    firstname: z.string()
        .min(5, { message: 'Prénom trop court: 5 minimum' }),

    lastname: z.string()
        .min(4, { message: 'Nom trop court: 4 minimum' }),

    username: z.string()
        .min(5, { message: 'Nom d’utilisateur trop court.' }),

    password: z.string()
        .min(5, { message: 'Mot de passe trop court.' }),

    email: z.string()
        .email({ message: 'E-mail invalide.' }),

    gender: z.string()
        .nonempty({ message: 'Genre requis.' }),
});
