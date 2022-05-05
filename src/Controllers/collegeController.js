const collegeModel = require("../Models/collegeModel")

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

module.exports.createCollege = createCollege