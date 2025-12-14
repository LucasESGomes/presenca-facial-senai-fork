import Joi from "joi";
import mongoose from "mongoose";

/**
 * Validação de ObjectId
 */
const objectId = Joi.string()
    .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    })
    .messages({
        "any.invalid": "O ID informado não é um ObjectId válido."
    });

const baseSchema = {
    name: Joi.string()
        .min(3)
        .max(80)
        .messages({
            "string.base": "O nome do totem deve ser um texto válido.",
            "string.empty": "O nome do totem é obrigatório.",
            "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
            "string.max": "O nome deve ter no máximo {#limit} caracteres."
        }),

    location: Joi.string()
        .min(3)
        .max(120)
        .messages({
            "string.base": "A localização deve ser um texto válido.",
            "string.empty": "A localização é obrigatória.",
            "string.min": "A localização deve ter ao menos {#limit} caracteres.",
            "string.max": "A localização deve ter no máximo {#limit} caracteres."
        }),

    room: objectId.messages({
        "any.required": "Você deve informar a sala (room) do totem."
    }),

    isActive: Joi.boolean().messages({
        "boolean.base": "O campo isActive deve ser verdadeiro ou falso."
    })
};

export const totemSchemas = {
    /**
     * 🔹 Criar totem
     * apiKey é gerada internamente
     */
    create: Joi.object({
        name: baseSchema.name.required(),
        location: baseSchema.location.required(),
        room: baseSchema.room.required(),
        isActive: baseSchema.isActive.optional()
    }).messages({
        "any.required": "Campo obrigatório ausente no corpo da requisição."
    }),

    /**
     * 🔹 Atualizar totem
     */
    update: Joi.object({
        name: baseSchema.name.optional(),
        location: baseSchema.location.optional(),
        room: baseSchema.room.optional(),
        isActive: baseSchema.isActive.optional()
    })
        .min(1)
        .messages({
            "object.min": "Envie pelo menos um campo para atualizar o totem."
        }),

    /**
     * 🔹 Alteração de status
     */
    status: Joi.object({
        isActive: baseSchema.isActive.required().messages({
            "any.required": "O campo isActive é obrigatório ao alterar o status."
        })
    }),

    /**
     * 🔹 Sem body
     */
    empty: Joi.object({})
};
