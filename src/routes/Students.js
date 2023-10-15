const express = require('express')
const StudentController = require('../controller/Students')
const router = express.Router()

router.get('/',StudentController.getStudents)
router.post('/create',StudentController.create)
router.put('/changeStudentMentor/:id',StudentController.changeStudentMentor)
router.get('/showprevmentor/:id',StudentController.showPreviousMentor)

module.exports = router