const express=require('express');
const router=express.Router();
const collegeController=require("../Controllers/collegeController")
const internController=require("../Controllers/internController")

//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.status(200).send("My server is running awesome!")
})
//--------------------------------------------------------//



router.post("/functionup/colleges",collegeController.createCollege)
router.post("/functionup/interns",internController.createIntern)



module.exports = router;