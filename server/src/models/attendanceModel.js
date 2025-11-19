import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        classCode: { type: String, required: true, uppercase: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["presente", "atrasado", "ausente"],
            default: "presente",
        },
        checkInTime: { type: Date },
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viaFacial: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
