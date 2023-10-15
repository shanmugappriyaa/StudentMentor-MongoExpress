const express = require('express')
const MentorController = require('../controller/Mentors')
const router = express.Router()

router.get('/',MentorController.getMentors)
router.post('/create',MentorController.createMentor)
router.put('/:id',MentorController.assignStudent)
router.get('/showstulist/:id',MentorController.showStuList)

module.exports = router