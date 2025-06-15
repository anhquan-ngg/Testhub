import { Router } from 'express';
import { addSubmission } from '../controllers/SubmissionController.js';

const submissionRoutes = Router();

submissionRoutes.post('/add-submission', addSubmission);

export default submissionRoutes;