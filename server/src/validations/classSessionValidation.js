import Joi from "joi";

const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "O ID informado deve ser um ObjectId válido.",
        "string.empty": "O ID não pode estar vazio."
    });

const subjectCode = Joi.string()
    .min(2)
    .max(20)
    .uppercase()
    .trim()
    .messages({
        "string.base": "O código da matéria deve ser um texto válido.",
        "string.empty": "O código da matéria não pode estar vazio.",
        "string.min": "O código da matéria deve ter no mínimo {#limit} caracteres.",
        "string.max": "O código da matéria deve ter no máximo {#limit} caracteres."
    });


export const classSessionSchemas = {
    // Criar sessão
    create: Joi.object({
        classId: objectId.required().messages({
            "any.required": "Você deve informar a turma."
        }),

        teacher: objectId.optional().messages({
            "string.pattern.base": "O ID do professor deve ser um ObjectId válido."
        }),

        room: objectId.required().messages({
            "any.required": "Você deve informar a sala da sessão."
        }),

        subjectCode: subjectCode.required().messages({
            "any.required": "Você deve informar a matéria da sessão."
        }),

        name: Joi.string()
            .min(3)
            .max(80)
            .required()
            .messages({
                "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
                "string.max": "O nome deve ter no máximo {#limit} caracteres.",
                "any.required": "Você deve informar o nome da sessão."
            })
    }),

    // Atualizar sessão
    update: Joi.object({
        name: Joi.string().min(3).max(80),
        date: Joi.date(),

        // opcionalmente permitir troca de matéria
        subjectCode: subjectCode.optional()
    })
        .min(1)
        .messages({
            "object.min": "Envie ao menos um campo para atualização."
        }),

    // Fechar sessão
    close: Joi.object({
        status: Joi.string()
            .valid("closed")
            .required()
            .messages({
                "any.only": "Para fechar a sessão, use status = 'closed'.",
                "any.required": "O campo status é obrigatório."
            })
    }),

    // Reset não recebe body
    reset: Joi.object({})
};
