const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const daytimeSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    time: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
        max: 180
    }
});

const classSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
        unique: true
    },
    className: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true
    },
    classType: {
        type: String,
        required: true,
        enum: ['General', 'Special']
    },
    description: String,
    daytime: [daytimeSchema],
    payRate: {
        type: Number,
        required: true,
        min: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {collection: "class"});

module.exports = mongoose.model("Class", classSchema);