const mentorModel = require("../models/Mentor");
const studentModel = require("../models/Student");

const getMentors = async (req, res) => {
  try {
    let mentors = await mentorModel.find();
    res.status(200).send({
      message: "data fetched Successfully",
      mentors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Erorr",
      error: error.message,
    });
  }
};

const createMentor = async (req, res) => {
  console.log(req.body);
  try {
    let mentor = await mentorModel.create(req.body);

    res.status(201).send({
      message: "Mentor created Successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const assignStudent = async (req, res) => {
  try {
    let mentor = await mentorModel.findOne({ _id: req.params.id });
    console.log(mentor);
    console.log(req.body);
    if (mentor) {
      let totalstudents = mentor.studentlist.concat(req.body.studentlist);
      /**check duplicate student*/
      mentor.studentlist = [...new Set(totalstudents)];
      let idCriteria = {
        _id: { $in: mentor.studentlist },
      };
      console.log(idCriteria);
      const selectedStudentList = await studentModel.find(idCriteria);
      console.log("Selected Student list-------> ", selectedStudentList);
      const studentHasMentorList = selectedStudentList.filter(
        (student) =>
          student.currentMentor !== null &&
          student.currentMentor !== undefined &&
          student.currentMentor !== "" && student.currentMentor !== req.params.id
      );
      console.log("studenthasmentor---->",studentHasMentorList)

      if (studentHasMentorList.length === 0) {
        /**update studentlist for selected mentor */
        const updatedmentor = await mentorModel.updateOne(
          { _id: req.params.id },
          { $set: { ...mentor } }
        );

        /** assign current mentor in student table */
        const result = await studentModel.updateMany(
          idCriteria,
          { currentMentor: req.params.id },
          { multi: true }
        );

        console.log("------------> ", result);
        res.status(201).send({
          message: "Students have assigned to mentor",
        });
      } else {
        res.status(201).send({
          message:
            "Some of your students have already assigned to another mentor. Plz check and try again",
        });
      }
    } else {
      res.status(201).send({
        message: "Invalid mentor Id",
      });
    }
    // console.log("updated mentor---",mentor)
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/** to show studentlist for particular mentor */
const showStuList = async (req, res) => {
  try {
    const mentor = await mentorModel.findOne({ _id: req.params.id });
    let idCriteria = {
      _id: { $in: mentor.studentlist },
    };
    const StudentDetails = await studentModel.find(idCriteria);

    res.status(201).send({
      message: "Data Fetched Successfully",
      StudentDetails,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getMentors, createMentor, assignStudent, showStuList };
