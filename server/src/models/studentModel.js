import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        registration: { type: String, required: true, unique: true }, // matrícula
        facialId: { type: String, unique: true },
        classCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true, // ex: "I2P4"
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
