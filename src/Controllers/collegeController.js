const collegeModel = require("../Models/collegeModel")

let nameRegex = /^[A-Za-z]{3,}$/ 

const createCollege = async function (req, res) {
    try {
        let data = req.body;

        if (Object.keys(data).length != 0) {

            if (!data.name || !data.name.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field Name!" })
            
            if (!data.fullName || !data.fullName.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field fullName!" })
            
            if (!data.logoLink || !data.logoLink.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field logoLink!" })
            
            // college name validation
            if(!nameRegex.test(data.name)) return res.status(400).send({ status: false, msg: "Name must be alphabetical and min length 3." })

            
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