import Joi from "joi";

/**
 * Campos base reutilizáveis
 */
const baseSchema = {
    code: Joi.string()
        .min(2)
        .max(20)
        .uppercase()
        .messages({
            "string.base": "O código da sala deve ser um texto válido.",
            "string.empty": "O código da sala não pode estar vazio.",
            "string.min": "O código da sala deve ter no mínimo {#limit} caracteres.",
            "string.max": "O código da sala deve ter no máximo {#limit} caracteres.",
            "any.required": "O código da sala é obrigatório."
        }),

    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.base": "O nome da sala deve ser um texto válido.",
            "string.empty": "O nome da sala não pode estar vazio.",
            "string.min": "O nome da sala deve ter no mínimo {#limit} caracteres.",
            "string.max": "O nome da sala deve ter no máximo {#limit} caracteres.",
            "any.required": "O nome da sala é obrigatório."
        }),

    location: Joi.string()
        .min(2)
        .max(100)
        .allow("")
        .messages({
            "string.base": "A localização deve ser um texto válido.",
            "string.min": "A localização deve ter no mínimo {#limit} caracteres.",
            "string.max": "A localização deve ter no máximo {#limit} caracteres."
        }),

    isActive: Joi.boolean().messages({
        "boolean.base": "O campo isActive deve ser booleano."
    })
};

/**
 * Schemas públicos
 */
export const roomSchemas = {

    // Criar sala
    create: Joi.object({
        code: baseSchema.code.required(),
        name: baseSchema.name.required(),
        location: baseSchema.location.optional(),
        isActive: baseSchema.isActive.optional()
    }),

    // Atualizar sala
    update: Joi.object({
        code: baseSchema.code.optional(),
        name: baseSchema.name.optional(),
        location: baseSchema.location.optional(),
        isActive: baseSchema.isActive.optional()
    })
        .min(1)
        .messages({
            "object.min": "Envie ao menos um campo para atualização."
        })
};
