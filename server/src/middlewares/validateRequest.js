import { ValidationError } from "../errors/appError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Middleware genérico de validação com Joi.
 * 
 * @param {Object} schema - Objeto Joi (ex: userSchemas.create)
 * @param {"body"|"query"|"params"} [property="body"] - Parte da requisição a validar
*/
export const validateRequest = (schema, property = "body") => {
    return (req, res, next) => {
        try {
            
            const data = req[property];
            
            const { error, value } = schema.validate(data, {
                abortEarly: true, // retorna só o primeiro erro
                stripUnknown: true, // remove campos não definidos no schema
            });
    
            if (error) {
                return ApiResponse.BADREQUEST(res, error.details[0].message);
            }
            
            // substitui o body pelo valor validado e sanitizado
            req[property] = value;
            next();
        } catch (error) {
            if (error.details){
                return ApiResponse.BADREQUEST(res, error.details[0].message);
            } else {
                console.error("❌ Erro inesperado na validação:", error);
                return ApiResponse.ERROR(res, "Erro interno do servidor");
            }
        }
    };
};
