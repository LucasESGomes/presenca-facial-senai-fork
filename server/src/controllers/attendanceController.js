import ApiResponse from "../utils/ApiResponse.js";
import AttendanceService from "../services/AttendanceService.js";
import controllerWrapper from "../utils/controllerWrapper.js";
import ClassSessionService from "../services/ClassSessionService.js";
import ClassService from "../services/ClassService.js";

const attendanceController = {

    /**
     * =========================================================
     * REGISTRO POR TOTEM (RECONHECIMENTO FACIAL)
     * =========================================================
     */
    markByFace: controllerWrapper(async (req, res) => {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return ApiResponse.BAD_REQUEST(
                res,
                "userId e roomId são obrigatórios."
            );
        }

        const result = await AttendanceService.markPresenceByFace({
            userId,
            roomId,
        });

        // Resposta diferente para pré-attendance
        if (result.type === "pre_attendance") {
            return ApiResponse.OK(
                res,
                result.message,
                result
            );
        }

        return ApiResponse.CREATED(
            res,
            "Presença registrada com sucesso.",
            result
        );
    }),

    /**
     * =========================================================
     * REGISTRO MANUAL (Professor / Coordenador)
     * =========================================================
     */
    markManual: controllerWrapper(async (req, res) => {
        const { classSessionId, studentId, status } = req.body;

        const session = await ClassSessionService.getById(classSessionId);
        if (!session)
            return ApiResponse.NOT_FOUND(res, "Sessão não encontrada.");

        // Se não for coordenador, valida vínculo do professor
        if (req.user.role !== "coordenador") {
            const teachers = await ClassService.getTeachers(session.class);
            const isTeacherFromClass = teachers?.some(
                t => t._id.toString() === req.user.id.toString()
            );

            if (!isTeacherFromClass) {
                return ApiResponse.FORBIDDEN(
                    res,
                    "Você não pode registrar presenças nesta turma."
                );
            }
        }

        const attendance = await AttendanceService.markPresenceManual({
            sessionId: classSessionId,
            studentId,
            status,
            recordedBy: req.user.id,
        });

        return ApiResponse.CREATED(
            res,
            "Presença registrada manualmente.",
            attendance
        );
    }),

    /**
     * =========================================================
     * CONSULTAS
     * =========================================================
     */
    getBySession: controllerWrapper(async (req, res) => {
        const { sessionId } = req.params;
        const records = await AttendanceService.getBySession(sessionId);
        return ApiResponse.OK(res, "", records);
    }),

    getByStudent: controllerWrapper(async (req, res) => {
        const { studentId } = req.params;
        const records = await AttendanceService.getAll({ student: studentId });
        return ApiResponse.OK(res, "", records);
    }),

    getByClass: controllerWrapper(async (req, res) => {
        const { classId } = req.params;
        const records = await AttendanceService.getByClass(classId);
        return ApiResponse.OK(res, "", records);
    }),

    /**
     * =========================================================
     * RELATÓRIO COMPLETO DA SESSÃO
     * =========================================================
     */
    getFullReportBySession: controllerWrapper(async (req, res) => {
        const { sessionId } = req.params;
        const report = await AttendanceService.getFullReportBySession(sessionId);
        return ApiResponse.OK(res, "", report);
    }),

    /**
     * =========================================================
     * UPDATE / DELETE
     * =========================================================
     */
    update: controllerWrapper(async (req, res) => {
        const updated = await AttendanceService.update(req.params.id, req.body);
        return ApiResponse.OK(res, "Presença atualizada.", updated);
    }),

    delete: controllerWrapper(async (req, res) => {
        await AttendanceService.delete(req.params.id);
        return ApiResponse.NO_CONTENT(res, "Registro removido.");
    }),
};

export default attendanceController;
