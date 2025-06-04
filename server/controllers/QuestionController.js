import Question from '../models/QuestionModel.js';

export const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await Question.findAll();
        return res.status(200).json({questions});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const getDetailQuestion = async (req, res, next) => {
    try {
        const {id} = req.params;
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({message: "Câu hỏi không tồn tại"});
        }
        return res.status(200).json(question);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const addQuestion = async (req, res, next) => {
    try {
        const {text, subject, type, options, correct_answer, created_by} = req.body;
        console.log(req.body);
        const question = await Question.create({text, subject, type, options, correct_answer, created_by});
        return res.status(201).json(question);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const updateQuestion = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {text, subject, type, options, correct_answer, created_by} = req.body;
        const question = await Question.update({text, subject, type, options, correct_answer, created_by}, {where: {id}});
        return res.status(200).json(question);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const deleteQuestion = async (req, res, next) => {
    try {
        const {id} = req.params;
        const question = await Question.destroy({where: {id}});
        return res.status(200).json(question);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}
