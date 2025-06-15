import { Submission, Exam, Question, User, UserExam} from '../models/index.js';

const checkIsCorrect = (submissions) => {
    return submissions.map(submission => {
        const question = Question.findByPk(submission.question_id);
        let is_correct = false;

        switch (question.type) {
            case 'single-choice':
                // Compare selected index with correct option index
                const correctOption = question.options.findIndex(option => option.is_correct);
                is_correct = correctOption === submission.selected_choice;
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
                
                break;

            case 'fill-in-blank':
                if (question.correct_answer && submission.answer_text) {
                    // Normalize answers by trimming whitespace and converting to lowercase
                    const normalizedCorrect = question.correct_answer.trim().toLowerCase();
                    const normalizedSubmitted = submission.answer_text.trim().toLowerCase();
                    is_correct = normalizedCorrect === normalizedSubmitted;
                    
                }
                break;
        }

        return { ...submission, is_correct };
    });
}

export const addSubmission = async (req, res) => {
    try {
        const { student_id, exam_id, answers, time_spent } = req.body;
        console.log("Received submission data:", req.body);

        if (!student_id || !exam_id || !answers || !time_spent) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        // Convert answers object to array of submission objects
        const submissionsArray = Object.entries(answers).map(([questionId, answer]) => ({
            student_id: student_id,
            exam_id: exam_id,
            question_id: parseInt(questionId),
            selected_choice: Array.isArray(answer) ? answer : typeof answer === 'number' ? answer : null,
            answer_text: typeof answer === 'string' ? answer : null,
            time_spent: time_spent
        }));

        // Debug log
        console.log("Submissions array:", submissionsArray);

        // Check if submissions is valid array
        if (!Array.isArray(submissionsArray)) {
            throw new Error('Failed to create submissions array');
        }

        const createdSubmissions = await Promise.all(
            submissionsArray.map(async (submission) => {
                const question = await Question.findByPk(submission.question_id);
                if (!question) {
                    throw new Error(`Question ${submission.question_id} not found`);
                }

                // Check answer correctness based on question type
                let is_correct = false;
                switch (question.type) {
                    case 'single-choice':
                        const correctOption = question.options.findIndex(opt => opt.is_correct);
                        is_correct = submission.selected_choice === correctOption;
                        break;
                    case 'multiple-choice':
                        const correctIndices = question.options
                            .map((opt, idx) => opt.is_correct ? idx : -1)
                            .filter(idx => idx !== -1);
                        is_correct = Array.isArray(submission.selected_choice) &&
                            submission.selected_choice.length === correctIndices.length &&
                            submission.selected_choice.every(choice => 
                                correctIndices.includes(Number(choice)));
                        break;
                    case 'fill-in-blank':
                        if (question.correct_answer && submission.answer_text) {
                            is_correct = question.correct_answer.trim().toLowerCase() === 
                                       submission.answer_text.trim().toLowerCase();
                        }
                        break;
                }

                return Submission.create({
                    ...submission,
                    is_correct
                });
            })
        );

        const totalQuestions = await Submission.count({ where: { exam_id, student_id } });
        const totalCorrect = await Submission.count({
            where: {
                exam_id,
                student_id,
                is_correct: true
            }
        });
        const totalScore = (totalCorrect / totalQuestions) * 10;

        await UserExam.update(
            { 
                total_score: totalScore,
                status: 'completed',
            },
            { where: { user_id: student_id, exam_id } }
        );

        res.status(201).json({ 
            message: "Nộp bài thành công",
            submissions: createdSubmissions
        });

    } catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({ 
            message: "Server bị lỗi",
            error: error.message 
        });
    }
}
