import { Router } from "express";
import UserController from "../controllers/UserController.js";
import ThoughtController from "../controllers/ThoughtsController.js";
import AuthMiddlewares from "../middlewares/authMiddlewares.js";

const router = Router();

/**
 * Auth Endpoints 
 */
router.post('/register', UserController.register);
router.post('/login', UserController.login);

/**
 * Thoughts Endpoints
 */
router.post('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.addThought)
router.get('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.getThoughts)
router.put('/thoughts/:thoughtId', AuthMiddlewares.isAuthorized, ThoughtController.updateThought)
router.delete('/thoughts/:thoughtId', AuthMiddlewares.isAuthorized, ThoughtController.deleteThought)
router.delete('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.deleteAllThoughts)
router.get('/thoughts/search', AuthMiddlewares.isAuthorized, ThoughtController.searchThoughts)

export default router;
