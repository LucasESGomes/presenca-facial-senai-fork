import { Router } from "express";
import attendanceController from "../controllers/attendanceController.js";
import { attendanceSchemas } from "../validations/attendanceValidation.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import totemApiAuth from "../middlewares/totemApiAuth.js";

const router = Router();

/**
 * =========================================================
 * CREATE
 * =========================================================
 */

// Registro manual (professor / coordenador)
router.post(
    "/manual",
    authenticateJWT(),
    validateRequest(attendanceSchemas.manual),
    attendanceController.markManual
);

// Registro facial (Totem)
// → cria Attendance se houver sessão aberta
// → cria PreAttendance se NÃO houver sessão aberta
router.post(
    "/facial",
    totemApiAuth,
    ...attendanceController.markByFace
);

/**
 * =========================================================
 * READ
 * =========================================================
 */

// Presenças de uma sessão
router.get(
    "/session/:sessionId",
    authenticateJWT(),
    attendanceController.getBySession
);

// Presenças de um aluno
router.get(
    "/student/:studentId",
    authenticateJWT(),
    attendanceController.getByStudent
);

// Presenças de uma turma
router.get(
    "/class/:classId",
    authenticateJWT(),
    attendanceController.getByClass
);

// Relatório completo da sessão
//
router.get(
    "/session/:sessionId/full-report",
    authenticateJWT(),
    attendanceController.getFullReportBySession
);

/**
 * =========================================================
 * UPDATE
 * =========================================================
 */

router.patch(
    "/:id",
    authenticateJWT(),
    validateRequest(attendanceSchemas.update),
    attendanceController.update
);

/**
 * =========================================================
 * DELETE
 * =========================================================
 */

router.delete(
    "/:id",
    authenticateJWT(),
    attendanceController.delete
);

export default router;
