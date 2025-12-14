import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        registration: { type: String, required: true, unique: true }, // matrícula
        facialId: { type: String, unique: true, select: false },
        classes: [
            {
                type: String,
                uppercase: true,
                trim: true
            }
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
