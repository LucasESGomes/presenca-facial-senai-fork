import {
    ValidationError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    AppError,
} from "./appError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Converte qualquer erro em uma resposta de API padronizada.
 * Usado tanto no errorHandler global quanto em controllers isolados.
 *
 * @param {Error} err - O erro lançado
 * @param {Response} res - Objeto de resposta Express
 */
export default function handleControllerError(err, res) {
    console.error("❌ Erro capturado:", err);

    if (err instanceof ValidationError) {
        return ApiResponse.BADREQUEST(res, err.message);
    }

    if (err instanceof NotFoundError) {
        return ApiResponse.NOTFOUND(res, err.message);
    }

    if (err instanceof ConflictError) {
        return ApiResponse.CONFLICT(res, err.message);
    }

    if (err instanceof UnauthorizedError) {
        return ApiResponse.UNAUTHORIZED(res, err.message);
    }

    if (err instanceof ForbiddenError) {
        return ApiResponse.FORBIDDEN(res, err.message);
    }

    if (err instanceof AppError) {
        return ApiResponse.ERROR(res, err.message);
    }
    else{
        // Caso o erro não seja identificado
        return ApiResponse.ERROR(res, "Erro interno do servidor");
    }
}
