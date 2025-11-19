import express from 'express';
import classController from '../controllers/classController.js'
import { validateRequest } from '../middlewares/validateRequest.js';
import { classSchemas } from '../validations/classValidation.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/', authenticateJWT("coordenador"), validateRequest(classSchemas.create), classController.create);
router.post('/:id/teachers/:teacherId', authenticateJWT("coordenador"), validateRequest(classSchemas.create), classController.addTeacher);

router.get('/', authenticateJWT("coordenador"), classController.getAll);
router.get('/:id/teachers', authenticateJWT(), classController.getTeachers);
router.get('/name/:name', authenticateJWT(), classController.getByName);
router.get('/:id', authenticateJWT(), classController.getById);

router.delete('/:id/teachers/:teacherId', authenticateJWT("coordenador"), classController.removeTeacher);
router.delete('/:id', classController.delete);

router.patch('/:id', classController.update);


export default router;
