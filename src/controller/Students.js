const userModel = require("../models/Student");
const mentorModel = require("../models/Mentor");
const studentModel = require("../models/Student");

const getStudents = async (req, res) => {
  try {
    let students = await userModel.find();
    res.status(200).send({
      message: "Students data fetched Successfully",
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Erorr",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  console.log(req.body);
  try {
    let students = await userModel.create(req.body);
    console.log("students---------> ", students);
    res.status(201).send({
      message: "Student Created Sucessfully",
      students,
    });
  } catch (error) {
    res.status(400).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const changeStudentMentor = async (req, res) => {
  try {
    let student = await studentModel.findOne({ _id: req.params.id });
    if (
      student.currentMentor !== null &&
      student.currentMentor !== "" &&
      student.currentMentor !== undefined
    ) {
      if (student.currentMentor === req.body.mentor_id) {
        return res.status(201).send({
          message: "current and new mentor is same person!..",
        });
      }
      const cMentor = student.currentMentor;
      student.currentMentor = req.body.mentor_id;
      student.previousMentor = cMentor;
      console.log("after student----------> ", student);
      const updatedMentor = await studentModel.updateOne(
        { _id: req.params.id },
        { $set: { ...student } }
      );

      /** remove student in previous mentor */
      const prevMent = await mentorModel.findOne({
        _id: student.previousMentor,
      });
      console.log("prevMent----------> ", prevMent);
      if (prevMent && prevMent.studentlist.length > 0) {
        const stuList = prevMent.studentlist.filter(
          (sid) => sid !== req.params.id
        );
        prevMent.studentlist = stuList;
        const updatedMenstuList = await mentorModel.updateOne(
          { _id: student.previousMentor },
          { $set: { ...prevMent } }
        );
      }

      /**update studentlist in mentor table */

      const updatedStudList = await mentorModel.findOneAndUpdate(
        { _id: req.body.mentor_id },
        { $push: { studentlist: req.params.id } },
        { new: true }
      );

      res
        .status(201)
        .send({ message: "Student mentor has been changed successfully" });
    } else {
      student.currentMentor = req.body.mentor_id;
      const updatedStuMentor = await studentModel.updateOne(
        { _id: req.params.id },
        { $set: { ...student } }
      );
      /** update student list in mentor table */
      const updatedStudList = await mentorModel.updateOne(
        { _id: req.body.mentor_id },
        { $setOnInsert: { studentlist: req.params.id } },
        { upsert: true }
      );
      console.log(updatedStudList);
    }
  } catch (error) {
    res.status(400).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**to show previous mentor */
const showPreviousMentor = async (req, res) => {
  console.log("showPreviousMentor", "----------------------------");
  try {
    let student = await studentModel.findOne({ _id: req.params.id });
    if (student?.previousMentor) {
      const prevMent = await mentorModel.findOne({
        _id: student.previousMentor,
      });
      res.status(200).send({
        message: "Previous mentor Details",
        prevMent,
      });
    } else {
      res.status(200).send({
        message: "There is no Previous mentor for this student",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getStudents,
  create,
  changeStudentMentor,
  showPreviousMentor,
};
