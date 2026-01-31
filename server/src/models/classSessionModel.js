import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
            index: true
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
            index: true
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subjectCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 80
        },

        date: {
            type: Date,
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
            index: true
        },

        closedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("ClassSession", classSessionSchema);
