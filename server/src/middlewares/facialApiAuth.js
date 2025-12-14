import ApiResponse from "../utils/ApiResponse.js";
import TotemService from "../services/TotemService.js";

export default async function facialApiAuth(req, res, next) {
    const key = req.headers["x-facial-api-key"];

    // Se não enviar a chave
    if (!key) {
        return ApiResponse.FORBIDDEN(res, "Acesso negado. Header 'x-facial-api-key' ausente.");
    }

    const x_facial_key = process.env.FACIAL_API_KEY

    if (key !== x_facial_key) {
        return ApiResponse.FORBIDDEN(res, "Acesso negado. Chave facial-api-key inválida.");
    }

    next();
}
