import BaseService from "./BaseService.js";
import Student from "../models/studentModel.js";
import Class from "../models/classModel.js";
import {
    ValidationError,
    NotFoundError,
    ConflictError,
} from "../errors/appError.js";

class StudentService extends BaseService {
    constructor() {
        super(Student);
    }

    async create(data) {
        if (!data.faceId)
            throw new ValidationError("O aluno precisa ter o reconhecimento facial cadastrado.");

        const duplicate = await this.model.findOne({ faceId: data.faceId });
        if (duplicate)
            throw new ConflictError("Identificação facial já cadastrada para outro aluno.");

        const classExists = await Class.findOne({ name: data.classCode });
        if (!classExists)
            throw new NotFoundError("Turma (classe) não encontrada.");

        return super.create(data);
    }

    async getByClassCode(classCode) {
        const students = await this.model.find({ classCode });
        if (!students.length)
            throw new NotFoundError("Nenhum aluno encontrado para esta turma.");
        return students;
    }

    async updateFaceData(id, newFaceId) {
        if (!newFaceId)
            throw new ValidationError("O novo ID facial é obrigatório.");

        const conflict = await this.model.findOne({ faceId: newFaceId });
        if (conflict)
            throw new ConflictError("Esse ID facial já está vinculado a outro aluno.");

        return super.update(id, { faceId: newFaceId });
    }
}

export default new StudentService();
