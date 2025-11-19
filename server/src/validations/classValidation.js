import Joi from "joi";

/**
 * Campos base usados tanto na criação quanto na atualização
 */
const baseSchema = {
    code: Joi.string()
        .min(2)
        .max(20)
        .uppercase()
        .messages({
            "string.base": "O código da turma deve ser um texto válido.",
            "string.empty": "O código da turma não pode estar vazio.",
            "string.min": "O código da turma deve ter no mínimo {#limit} caracteres.",
            "string.max": "O código da turma deve ter no máximo {#limit} caracteres.",
            "any.required": "O código da turma é obrigatório."
        }),

    course: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.base": "O curso deve ser um texto válido.",
            "string.empty": "O curso não pode estar vazio.",
            "string.min": "O curso deve ter no mínimo {#limit} caracteres.",
            "string.max": "O curso deve ter no máximo {#limit} caracteres.",
            "any.required": "O curso é obrigatório."
        }),

    shift: Joi.string()
        .valid("manhã", "tarde", "noite")
        .messages({
            "any.only": "O turno deve ser manhã, tarde ou noite.",
            "string.base": "O turno deve ser um texto válido.",
            "string.empty": "O turno é obrigatório."
        }),

    year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .messages({
            "number.base": "O ano deve ser um número válido.",
            "number.empty": "O ano é obrigatório.",
            "number.min": "O ano não pode ser inferior a {#limit}.",
            "number.max": "O ano não pode ser superior a {#limit}.",
            "any.required": "O ano é obrigatório."
        }),

    teachers: Joi.array()
        .items(
            Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .messages({
                    "string.pattern.base": "Cada professor deve ser um ObjectId válido."
                })
        )
        .messages({
            "array.base": "A lista de professores deve ser um array."
        })
};

/**
 * Schemas específicos para criação e atualização
 */
export const classSchemas = {
    // Criação de turma
    create: Joi.object({
        code: baseSchema.code.required(),
        course: baseSchema.course.required(),
        shift: baseSchema.shift.required(),
        year: baseSchema.year.required(),
        teachers: baseSchema.teachers.optional()
    }),

    // Atualização de turma
    update: Joi.object({
        code: baseSchema.code.optional(),
        course: baseSchema.course.optional(),
        shift: baseSchema.shift.optional(),
        year: baseSchema.year.optional(),
        teachers: baseSchema.teachers.optional()
    })
        .min(1)
        .messages({
            "object.min": "Envie pelo menos um campo para atualização."
        })
};
