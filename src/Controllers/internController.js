const collegeModel = require("../Models/collegeModel")
const internModel = require('../Models/internModel')
const ObjectId = require("mongoose").Types.ObjectId;


let nameRegex = /^[A-Za-z]{2,}$/
let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
let mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

// intern Creation

const createIntern = async function (req, res) {
    try {
        let data = req.body;

        if (Object.keys(data).length != 0) {

            const { name, mobile, email, collegeId } = data

            if (!name || !name.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field Name!" })
            }
            if (!mobile) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field mobile Number!" })
            }
            if (!email) {
                return res.status(400).send({ status: false, msg: "Please enter the required field email" })
            }
            if (!collegeId || !collegeId.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field college Id!" })
            }
            // Validation of ID format
            if (!ObjectId.isValid(collegeId)) return res.status(400).send({ status: false, msg: "Not a valid college ID" })

            // Validation of id exist or not
            let id = req.body.collegeId
            let findcollegeId = await collegeModel.findById(id)
            if (!findcollegeId) {
                return res.status(404).send({ status: false, msg: "College Id Not found. Please enter a valid college Id." })
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
//  GET college 

const getCollegeDetails = async function (req, res) {
    try {
        let queryParams=req.query
        const {collegeName}= req.query
        if (!Object.keys(queryParams).length > 0) {
            return res.status(400).send({ status: false, msg: "Invalid filters!!" })
        }
        if (!collegeName) {
            return res.status(400).send({ status: false, msg: "Please Enter a college Name" })
        }
        if (collegeName !== collegeName.toLowerCase()) {
            return res.status(400).send({ status: false, msg: "Invalid college Abbrivation" })
        }
        //college name must be a single word
        if (collegeName.split(" ").length > 1) {
            return res.status(400).send({ status: false, msg: "Please provide a valid Abbrivation" });
        }
        //check name is valid or not 
        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) {
            return res.status(404).send({ status: false, msg: "college not found,please check the college name" })
        }
        const collegeId = college._id
        const InternsIncollege = await internModel.find({ collegeId: collegeId }).select({ _id:1, email:1, name:1, mobile:1 })
        //destructuring of object
        const { name, fullName, logoLink } = college;

        const finalData = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interests: InternsIncollege.length ? InternsIncollege : { msg: "No-one is applied for the internship in this college" }
        }
        res.status(200).send({ status: true, msg: "college Details", Data: finalData })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message });
    }
}



module.exports.createIntern = createIntern
module.exports.getCollegeDetails = getCollegeDetails