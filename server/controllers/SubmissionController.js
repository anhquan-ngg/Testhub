import Submission from "../models/SubmissionModel.js";
import Question from "../models/QuestionModel.js";

export const getListSubmissions = async (req, res) => {

}

export const addSubmission = async (req, res) => {
    try {
        const { student_id, exam_id, answers, time_spent } = req.body;
        console.log("Received submission data:", req.body);
        
        if (!student_id || !exam_id || !answers || !time_spent) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        const submissions = Object.entries(answers).map(([questionId, answer]) => ({
            student_id: student_id,
            exam_id: exam_id,
            question_id: parseInt(questionId),
            selected_choice: Array.isArray(answer) ? answer : typeof answer === 'number' ? answer : null,
            answer_text: typeof answer === 'string' ? answer : null,
            time_spent: time_spent
        }));

        console.log("Processed submissions:", submissions);

        for (const submission of submissions) {
            const question = await Question.findByPk(submission.question_id);
            console.log('Processing question:', {
                id: question.id,
                type: question.type,
                submission: submission
            });

            let is_correct = false;
            switch (question.type) {
                case 'single-choice':
                    // Compare selected index with correct option index
                    const correctOption = question.options.findIndex(option => option.is_correct);
                    is_correct = correctOption === submission.selected_choice;
                    console.log('Single choice check:', {
                        correctOption,
                        selectedChoice: submission.selected_choice,
                        isCorrect: is_correct
                    });
                    break;

                case 'multiple-choice':
                    // Get indices of correct options
                    const correctIndices = question.options
                        .map((option, index) => option.is_correct ? index : -1)
                        .filter(index => index !== -1);
                    
                    // Check if selected choices match correct indices
                    is_correct = Array.isArray(submission.selected_choice) &&
                        submission.selected_choice.length === correctIndices.length &&
                        submission.selected_choice.every(choice => 
                            correctIndices.includes(Number(choice)));
                    
                    console.log('Multiple choice check:', {
                        correctIndices,
                        selectedChoices: submission.selected_choice,
                        isCorrect: is_correct
                    });
                    break;

                case 'fill-in-blank':
                    if (question.correct_answer && submission.answer_text) {
                        // Normalize answers by trimming whitespace and converting to lowercase
                        const normalizedCorrect = question.correct_answer.trim().toLowerCase();
                        const normalizedSubmitted = submission.answer_text.trim().toLowerCase();
                        is_correct = normalizedCorrect === normalizedSubmitted;
                        
                        console.log('Fill in blank check:', {
                            correct: normalizedCorrect,
                            submitted: normalizedSubmitted,
                            isCorrect: is_correct
                        });
                    }
                    break;
            }

            submission.is_correct = is_correct;
            await Submission.create(submission);
        }

        res.status(201).json({ 
            message: "Nộp bài thành công",
            submissions,
        });
    } catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const getDetailSubmission = async (req, res) => {

}
