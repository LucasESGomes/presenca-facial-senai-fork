import authController from "../controllers/authController.js";
import express from 'express';

const router = express.Router();

router.post('/login', authController.login);

export default router;
