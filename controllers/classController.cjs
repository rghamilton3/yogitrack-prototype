const Class = require("../models/classModel.cjs");
const Instructor = require("../models/instructorModel.cjs");

// Helper function to check for schedule conflicts
const checkScheduleConflict = async (daytime, excludeClassId = null) => {
    for (const dt of daytime) {
        const conflictQuery = {
            "daytime": {
                $elemMatch: {
                    "day": dt.day,
                    "time": dt.time
                }
            },
            "active": true
        };

        // Exclude current class when updating
        if (excludeClassId) {
            conflictQuery.classId = { $ne: excludeClassId };
        }

        const conflictingClass = await Class.findOne(conflictQuery);
        if (conflictingClass) {
            return {
                hasConflict: true,
                conflictingClass: conflictingClass,
                conflictingTime: `${dt.day} ${dt.time}`
            };
        }
    }
    return { hasConflict: false };
};

// Helper function to suggest alternative times
const suggestAlternatives = async (day, originalTime, duration) => {
    const timeSlots = [
        "09:00:00", "10:00:00", "11:00:00", "12:00:00",
        "13:00:00", "14:00:00", "15:00:00", "16:00:00",
        "17:00:00", "18:00:00", "19:00:00", "20:00:00"
    ];

    const alternatives = [];

    for (const time of timeSlots) {
        if (time === originalTime) continue;

        const conflictCheck = await checkScheduleConflict([{ day, time, duration }]);
        if (!conflictCheck.hasConflict) {
            alternatives.push({ day, time, duration });
        }
    }

    return alternatives.slice(0, 3); // Return max 3 alternatives
};

exports.getClass = async (req, res) => {
    try {
        const classId = req.query.classId;
        const classDetail = await Class.findOne({ classId: classId });
        res.json(classDetail);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getClassIds = async (req, res) => {
    try {
        const classes = await Class.find(
            { active: true },
            { classId: 1, className: 1, _id: 0 }
        ).sort();
        res.json(classes);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getNextId = async (req, res) => {
    try {
        const lastClass = await Class.find({})
            .sort({ classId: -1 })
            .limit(1);

        let maxNumber = 1;
        if (lastClass.length > 0) {
            const lastId = lastClass[0].classId;
            const match = lastId.match(/\d+$/);
            if (match) {
                maxNumber = parseInt(match[0]) + 1;
            }
        }
        const nextId = `A${maxNumber.toString().padStart(3, '0')}`;
        res.json({ nextId });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.add = async (req, res) => {
    try {
        const {
            classId,
            className,
            instructorId,
            classType,
            description,
            daytime,
            payRate
        } = req.body;

        // Basic validation
        if (!className || !instructorId || !classType || !daytime || !payRate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate instructor exists
        const instructor = await Instructor.findOne({ instructorId });
        if (!instructor) {
            return res.status(400).json({ message: "Instructor not found" });
        }

        // Check for schedule conflicts
        const conflictCheck = await checkScheduleConflict(daytime);
        if (conflictCheck.hasConflict) {
            // Suggest alternatives for the conflicting time slot
            const conflictingDT = daytime.find(dt =>
                dt.day === conflictCheck.conflictingTime.split(' ')[0] &&
                dt.time === conflictCheck.conflictingTime.split(' ')[1]
            );

            const alternatives = await suggestAlternatives(
                conflictingDT.day,
                conflictingDT.time,
                conflictingDT.duration
            );

            return res.status(409).json({
                message: "Schedule conflict detected",
                conflictRequired: true,
                conflictingClass: conflictCheck.conflictingClass,
                conflictingTime: conflictCheck.conflictingTime,
                suggestedAlternatives: alternatives
            });
        }

        // Create new class
        const newClass = new Class({
            classId,
            className: className.trim(),
            instructorId,
            classType,
            description: description?.trim(),
            daytime,
            payRate,
            active: true
        });

        await newClass.save();

        // Send confirmation messages (simulated)
        console.log(`📧 Confirmation sent to manager: Class "${className}" successfully scheduled for ${instructor.firstname} ${instructor.lastname}.`);
        console.log(`📧 Confirmation sent to ${instructor.email}: You have been assigned to teach "${className}". Class ID: ${classId}.`);

        res.status(201).json({
            message: "Class added successfully",
            class: newClass,
            confirmationSent: true
        });

    } catch (err) {
        console.error("Error adding class:", err.message);
        res.status(500).json({ message: "Failed to add class", error: err.message });
    }
};

exports.addWithConflict = async (req, res) => {
    try {
        const {
            classId,
            className,
            instructorId,
            classType,
            description,
            daytime,
            payRate
        } = req.body;

        // Basic validation
        if (!className || !instructorId || !classType || !daytime || !payRate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate instructor exists
        const instructor = await Instructor.findOne({ instructorId });
        if (!instructor) {
            return res.status(400).json({ message: "Instructor not found" });
        }

        // Create new class (manager has confirmed conflict override)
        const newClass = new Class({
            classId,
            className: className.trim(),
            instructorId,
            classType,
            description: description?.trim(),
            daytime,
            payRate,
            active: true
        });

        await newClass.save();

        // Send confirmation messages (simulated)
        console.log(`📧 Confirmation sent to manager: Class "${className}" successfully scheduled (conflict override).`);
        console.log(`📧 Confirmation sent to ${instructor.email}: You have been assigned to teach "${className}". Class ID: ${classId}.`);

        res.status(201).json({
            message: "Class added successfully with conflict override",
            class: newClass,
            confirmationSent: true
        });

    } catch (err) {
        console.error("Error adding class with conflict:", err.message);
        res.status(500).json({ message: "Failed to add class", error: err.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { classId } = req.query;
        const result = await Class.findOneAndUpdate(
            { classId },
            { active: false },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.json({ message: "Class deactivated", classId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const schedule = await Class.find({ active: true })
            .populate('instructorId', 'firstname lastname')
            .sort({ 'daytime.day': 1, 'daytime.time': 1 });

        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};