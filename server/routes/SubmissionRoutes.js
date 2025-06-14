import { Router } from 'express';
import { getListSubmissions, addSubmission, getDetailSubmission } from '../controllers/SubmissionController.js';

const submissionRoutes = Router();

submissionRoutes.get('/list-submissions', getListSubmissions);
submissionRoutes.post('/add-submission', addSubmission);
submissionRoutes.get('/detail-submission/:id', getDetailSubmission);

export default submissionRoutes;