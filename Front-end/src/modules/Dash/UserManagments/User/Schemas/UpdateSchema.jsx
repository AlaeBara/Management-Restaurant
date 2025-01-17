import { z } from 'zod';

export const UpdateSchema = z.object({
    firstname: z.string()
    .min(3, { message: 'Prénom trop court: 3 caractères minimum' })
    .max(20, { message: 'Prénom trop long: 20 caractères maximum' }),

    lastname: z.string()
        .min(3, { message: 'Nom trop court: 3 caractères minimum' })
        .max(20, { message: 'Nom trop long: 20 caractères maximum' }),

    username: z.string()
        .min(5, { message: 'Nom d’utilisateur trop court.' })
        .max(20, { message: 'Nom d’utilisateur trop long.' }),

    password: z.string().optional().nullable().or(z.literal("")),

    email: z.string()
        .email({ message: 'E-mail invalide.' }),

    gender: z.string()
        .nonempty({ message: 'Genre requis.' }),

    address: z.string().optional().nullable().or(z.literal("")),

    phone: z.string()
        .nullable()
        .optional()
        .refine(value => value === null || /^[+]?[0-9\s]*$/.test(value), {
            message: 'Numéro de téléphone invalide.',
        }),

        roleId: z.number().int().nullable().optional(),
    
    status : z.string().optional().nullable().or(z.literal("")),

    // avatar: z
    //     .any() 
    //     .optional() 
    //     .refine(
    //     (file) => !file || (file instanceof File && file.type.startsWith('image/')), // Validate if file is provided
    //         { message: "Le fichier doit être une image." }
    //     ),

    avatar: z
    .union([
        z.string(), // Allow URLs (existing avatar)
        z.instanceof(File).refine(
        (file) => file.type.startsWith('image/'), // Validate if file is provided
        { message: "Le fichier doit être une image." }
        ),
    ])
    .optional(), // Make the field optional
});
