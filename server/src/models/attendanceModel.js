import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ClassSession",
            required: true,
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        status: {
            type: String,
            enum: ["presente", "atrasado", "ausente"],
            default: "presente",
        },

        checkInTime: {
            type: Date,
            default: null,
        },

        /**
         * Quem registrou a presença:
         * - null → reconhecimento facial (totem)
         * - User._id → professor/coordenador
         */
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

attendanceSchema.index(
    { session: 1, student: 1 },
    { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
