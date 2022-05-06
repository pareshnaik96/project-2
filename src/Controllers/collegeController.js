const collegeModel = require('../Models/collegeModel')
const internModel = require('../Models/internModel')

let nameRegex = /^[A-Za-z]{3,}$/    

let urlRegex=/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi

const isValid = function(value) {
    const dv = /[a-zA-Z]/;
    if(typeof value !== 'string') return false
    if(!dv.test(value) ) return false
    return true
    }


const createCollege = async function (req, res) {
    try {
        let data = req.body;

        if (Object.keys(data).length != 0) {
             
            const {name,fullName,logoLink}=data

            if (!name || !name.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field Name!" })
            }
            if (!fullName || !fullName.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field fullName!" })
            }
            if (!logoLink || !logoLink.trim()) {
                return res.status(400).send({ status: false, msg: "Please Fill the required field logoLink!" })
            }
            // college name validation
            if (!nameRegex.test(name)) {
                return res.status(400).send({ status: false, msg: "Name must be alphabetical and min length 3." })
            }
            // validation for fullName
            if (!isValid(fullName)) {
                return res.status(400).send({ status: false, msg: "Please Enter a valid college name." })
            }
            // validate URL
            if (!urlRegex.test(logoLink)){
                return res.status(400).send({ status: false, msg: "Must be a Valid URL"})
            }
            
            let saveData = await collegeModel.create(data)
            res.send({ status: true, data: saveData })
        } else {
            return res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

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
        
        const InternsInCollege = await internModel.find({ collegeId : collegeId }).select({ _id :1, email:1, name:1, mobile:1 })
                
        // Destructing Of Objects
        const { name, fullName, logoLink } = college;

        const finalData = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interests: InternsInCollege.length ? InternsInCollege : { msg: "No-one is applied for the internship in this college" }
        }
        res.status(200).send({ status: true, msg: "college Details", Data: finalData })

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails