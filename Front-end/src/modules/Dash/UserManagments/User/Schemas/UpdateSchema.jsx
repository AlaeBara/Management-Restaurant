import { z } from 'zod';

export const UpdateSchema = z.object({
    firstname: z.string()
        .min(5, { message: 'Prénom trop court' }),

    lastname: z.string()
        .min(5, { message: 'Nom trop court.' }),

    address: z.string()
        .min(5, { message: "L'adresse est trop courte." })
        .optional()
        .nullable()
        .or(z.literal("")),

    gender: z.string()
        .nonempty({ message: 'Genre requis.' }),

    phone: z.string()
        .nullable()
        .optional()
        .refine(value => value === null || /^[+]?[0-9\s]*$/.test(value), {
            message: 'Numéro de téléphone invalide.',
        }),
});
