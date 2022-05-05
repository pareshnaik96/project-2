const mongoose = require('mongoose');


const collegeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
            trim: true
        },
        fullName: {
            type: String,
            required: [true, "FullName is required"],
            trim: true
        },
        logoLink: {
            type: String,
            required: [true, "logoLink is required"],
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('College', collegeSchema);
