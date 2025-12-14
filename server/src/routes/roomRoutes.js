import { Router } from "express";
import roomController from "../controllers/roomController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { roomSchemas } from "../validations/roomValidation.js";

const router = Router();

// Criar sala (somente coordenador)
router.post(
    "/",
    authenticateJWT("coordenador"),
    validateRequest(roomSchemas.create),
    roomController.create
);

// Listar todas as salas
router.get(
    "/",
    authenticateJWT(),
    roomController.getAll
);

// Buscar sala por ID
router.get(
    "/:id",
    authenticateJWT(),
    roomController.getById
);

// Atualizar sala
router.patch(
    "/:id",
    authenticateJWT("coordenador"),
    validateRequest(roomSchemas.update),
    roomController.update
);

// Ativar / Desativar sala
router.patch(
    "/:id/toggle-status",
    authenticateJWT("coordenador"),
    validateRequest(roomSchemas.update),
    roomController.updateStatus
);

// Deletar sala
router.delete(
    "/:id",
    authenticateJWT("coordenador"),
    roomController.delete
);

export default router;
