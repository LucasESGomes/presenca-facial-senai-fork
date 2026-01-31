import mongoose from "mongoose";

const subjectSubSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const classSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        course: { type: String, required: true },

        shift: {
            type: String,
            enum: ["manhã", "tarde", "noite"],
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        // Professores associados à turma
        teachers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // referência ao model User
            },
        ],

        // Salas físicas possíveis para essa turma
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
            },
        ],

        subjects: {
            type: [subjectSubSchema],
            default: [],
            validate: {
                validator: function (subjects) {
                    const codes = subjects.map(s => s.code);
                    return codes.length === new Set(codes).size;
                },
                message: "Códigos de matérias duplicados na turma.",
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Class", classSchema);
