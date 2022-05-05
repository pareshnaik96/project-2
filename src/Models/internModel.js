const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId

let validateEmail = function (email) {
    let emailRegex = /^\w+[\.-]?\w+@\w+[\.-]?\w+(\.\w{1,3})+$/;
    return emailRegex.test(email)
};
let validateMobile = function (mobile) {
    let mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return mobileRegex.test(mobile)
};

const internSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            validation: [validateEmail, "Please enter a valid email address"],
            trim: true
        },
        mobile: {
            type: Number,
            required: [true, "Mobile number is required"],
            unique: true,
            validation: [validateMobile, "Please enter a valid mobile number"],
            trim: true
        },
        collegeId: {
            type: objectId,
            refs: 'College',
            required: [true, "College Id is required"],
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Intern', internSchema);


