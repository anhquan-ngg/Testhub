import Exam from '../models/ExamModel.js';

export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
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
