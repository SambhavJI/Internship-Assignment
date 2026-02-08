import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
