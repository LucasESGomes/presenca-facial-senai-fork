import BaseService from "./BaseService.js";
import Attendance from "../models/attendanceModel.js";
import Student from "../models/studentModel.js";
import {
    NotFoundError,
    ConflictError,
} from "../errors/appError.js";

class AttendanceService extends BaseService {
    constructor() {
        super(Attendance);
    }

    /**
     * Marca presença com base no reconhecimento facial do aluno.
     * @param {string} faceId - ID facial do aluno reconhecido.
     */
    async markPresenceByFace(faceId) {
        const student = await Student.findOne({ faceId });
        if (!student) throw new NotFoundError("Aluno não encontrado para o ID facial informado.");

        // Evita duplicar presença no mesmo dia
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alreadyMarked = await this.model.findOne({
            studentId: student._id,
            date: { $gte: today },
        });

        if (alreadyMarked)
            throw new ConflictError("Presença já registrada para hoje.");

        return super.create({
            studentId: student._id,
            classCode: student.classCode,
            method: "facial",
            timestamp: new Date(),
        });
    }
}

export default new AttendanceService();
