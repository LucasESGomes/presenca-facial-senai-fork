import ApiResponse from "../utils/ApiResponse.js";
import TotemService from "../services/TotemService.js";

export default async function totemApiAuth(req, res, next) {
    const key = req.headers["x-totem-api-key"];

    // Se não enviar a chave
    if (!key) {
        return ApiResponse.FORBIDDEN(res, "Acesso negado. Header 'x-totem-api-key' ausente.");
    }

    try {
        const totem = await TotemService.getByApiKey(key);
        req.totem = totem;
        next();
    } catch (error) {
        return ApiResponse.FORBIDDEN(res, "Acesso negado. Chave facial-api-key inválida.");
    }
}
