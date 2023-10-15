const express = require('express')
const StudentRoutes = require('../routes/Students')
const MentorRoutes = require('../routes/Mentors')
const route = express.Router();


route.use('/students',StudentRoutes)
route.use('/mentors',MentorRoutes)

module.exports = route;