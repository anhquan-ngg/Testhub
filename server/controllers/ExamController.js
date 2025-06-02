import Exam from '../models/ExamModel.js';

export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.findAll();
    console.log(exams);
    res.status(200).json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server bị lỗi'});
  }
};

export const getExamDetail = async (req, res, next) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
};

export const addExam = async (req, res, next) => {
  try {
    const { title, subject, teacher_id, duration, start_time, end_time} = req.body;
    const exam = await Exam.create({ title, subject, teacher_id, duration, start_time, end_time});
    console.log(exam);
    res.status(201).json(exam);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server bị lỗi'});
  }
}

export const updateExam = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
};

export const deleteExam = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
};
