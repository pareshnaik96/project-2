const collegeModel = require("../Models/collegeModel")
const internModel = require('../Models/internModel')
const ObjectId = require("mongoose").Types.ObjectId;


let nameRegex = /^[A-Za-z]{2,}$/
let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
let mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

// intern Creation

const createIntern = async function (req, res) {
    try {
        let reqBody = req.body;

        if (Object.keys(reqBody).length != 0) {

            const { name, mobile, email, collegeName, isDeleted } = reqBody

            if (!name || !name.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field Name!" })
            }
            if (!mobile) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field mobile Number!" })
            }
            if (!email) {
                return res.status(400).send({ status: false, msg: "Please enter the required field email" })
            }
            if (!collegeName || !collegeName.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field college Name!" })
            }
            
            // name validation
            if (!nameRegex.test(name)) {
                return res.status(400).send({ status: false, msg: "Name must be alphabetical and min length 2." })
            }
            //  validate mobile number
            if (!mobileRegex.test(mobile)) {
                return res.status(400).send({ status: false, msg: "Please provide valid mobile number" })
            }
            // Email Validation
            if (!emailRegex.test(email)) {
                return res.status(400).send({ status: false, msg: "Please provide valid email" })
            }
            // Unique Email
            const usedEmail = await internModel.findOne({ email: email })
            if (usedEmail) {
                return res.status(400).send({ status: false, msg: "Email Id already exists." })
            }

            //  isDeleted Should be False       
            if (isDeleted === true) {
                return res.status(400).send({ status: false, msg: "New entries can't be deleted" });
            }

            // Check that College Exists or not 
            let collegeData = await collegeModel.findOne({ name: collegeName })

            if (!collegeData) {
                return res.status(404).send({ status: false, msg: "No College found With This Name , Check Name And Try Again" })
            }

            const collegeId = collegeData._id;

            // Finally the registration of intern is successful
            let data = { isDeleted, name, mobile, email, collegeId }

            let saveData = await internModel.create(data);
            return res.status(201).send({ status: true, data: saveData });
        } else {
            return res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}



module.exports.createIntern = createIntern
