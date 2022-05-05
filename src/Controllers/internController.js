const collegeModel = require("../Models/collegeModel")
const internModel = require('../Models/internModel')
const ObjectId = require("mongoose").Types.ObjectId;


let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
let nameRegex = /^[A-Za-z]{2,}$/  
let mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

// intern Creation

const createIntern = async function (req, res) {
    try {
        let data = req.body;
        // if (!isValidData(data)) {
        //     return res.status(400).send({ status: false, msg: "Invalid request parameter,Please provide intern details" })
        // }

        if (Object.keys(data).length != 0) {

            if (!data.name || !data.name.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field Name!" })

            if (!data.mobile) return res.status(400).send({ status: false, msg: "Please Fill the required field mobile Number!" })

            if (!data.email) return res.status(400).send({ status: false, msg: "Please enter the required field email" })

            if (!data.collegeId || !data.collegeId.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field collegeId!" })
            
            // name validation
            if(!nameRegex.test(data.name)) return res.status(400).send({ status: false, msg: "Name must be alphabetical and min length 2." })

            //  validate mobile number
             if(!mobileRegex.test(data.mobile)) return res.status(400).send({ status: false, msg: "Please provide valid mobile number" })

             // Email Validation
             if (!emailRegex.test(data.email)) return res.status(400).send({ status: false, msg: "Please provide valid email" })
             // Unique Email
             const usedEmail = await internModel.findOne({ email: data.email })
             if (usedEmail) return res.status(400).send({ status: false, msg: "Email Id already exists." })

             // Validation of ID format
             if (!ObjectId.isValid(data.collegeId))  return res.status(400).send({ status: false, msg: "Not a valid college ID" })
             // Validation of id exist or not
            let id = req.body.collegeId
            let findcollegeId = await collegeModel.findById(id)
            if (!findcollegeId) return res.status(404).send({ status: false, msg: "College Id Not found. Please enter a valid college id." })

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