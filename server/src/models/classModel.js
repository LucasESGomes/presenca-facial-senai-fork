import mongoose from "mongoose";

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
    },
    { timestamps: true }
);

export default mongoose.model("Class", classSchema);
