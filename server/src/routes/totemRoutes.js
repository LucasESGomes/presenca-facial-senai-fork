import { Router } from "express";
import totemController from "../controllers/totemController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { totemSchemas } from "../validations/totemValidation.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * ============================
 * ROTAS ADMINISTRATIVAS
 * (Somente COORDENADOR)
 * ============================
 */

// Criar um novo totem (gera apiKey internamente)
router.post(
    "/",
    authenticateJWT("coordenador"),
    validateRequest(totemSchemas.create),
    totemController.create
);

// Listar todos os totens
router.get(
    "/",
    authenticateJWT("coordenador"),
    totemController.getAll
);

// Buscar totem por ID
router.get(
    "/:id",
    authenticateJWT("coordenador"),
    totemController.getById
);

// Atualizar dados do totem
router.patch(
    "/:id",
    authenticateJWT("coordenador"),
    validateRequest(totemSchemas.update),
    totemController.update
);

// Ativar / desativar totem
router.patch(
    "/:id/toggle-status",
    authenticateJWT("coordenador"),
    totemController.toggleStatus
);

// Obter apiKey do totem (exibição controlada)
router.get(
    "/:id/api-key",
    authenticateJWT("coordenador"),
    totemController.getApiKey
);

// Remover totem
router.delete(
    "/:id",
    authenticateJWT("coordenador"),
    totemController.delete
);

// regenerar apiKey do totem
router.post(
    "/:id/regenerate-api-key",
    authenticateJWT("coordenador"),
    totemController.regenerateApiKey
);

export default router;
