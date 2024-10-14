/**
 * @file routes.js
 * @brief Express router for MindReveal API.
 * 
 * This file defines the routes for the MindReveal API, handling user authentication, 
 * thoughts management, and categories management using Express.
 */

// Importing necessary modules
import { Router } from "express"; ///< Importing Router from Express for route handling.
import UserController from "../controllers/UserController.js"; ///< Importing UserController for user-related operations.
import ThoughtController from "../controllers/ThoughtsController.js"; ///< Importing ThoughtController for thought-related operations.
import AuthMiddlewares from "../middlewares/authMiddlewares.js"; ///< Importing authentication middlewares.
import CategoryController from "../controllers/CategoryController.js"; ///< Importing CategoryController for category-related operations.

// Creating a new router instance
const router = Router();

/**
 * @section Auth Endpoints
 * 
 * This section handles user authentication related operations.
 */
router.post('/register', UserController.register); ///< Endpoint for user registration.
router.post('/login', UserController.login); ///< Endpoint for user login.

/**
 * @section Thoughts Endpoints
 * 
 * This section handles operations related to user thoughts.
 */
router.post('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.addThought); ///< Add a new thought.
router.get('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.getThoughts); ///< Retrieve all thoughts.
router.get('/thoughts/:thoughtId', AuthMiddlewares.isAuthorized, ThoughtController.getOneThought) ///< Retrieve one thought of a sepcific id.
router.put('/thoughts/:thoughtId', AuthMiddlewares.isAuthorized, ThoughtController.updateThought); ///< Update a specific thought.
router.delete('/thoughts/:thoughtId', AuthMiddlewares.isAuthorized, ThoughtController.deleteThought); ///< Delete a specific thought.
router.delete('/thoughts', AuthMiddlewares.isAuthorized, ThoughtController.deleteAllThoughts); ///< Delete all thoughts.
router.get('/thoughts/search', AuthMiddlewares.isAuthorized, ThoughtController.searchThoughts); ///< Search for thoughts.

/**
 * @section Categories Endpoints
 * 
 * This section handles operations related to categories.
 */
router.post('/categories', AuthMiddlewares.isAuthorized, CategoryController.createCateogry); ///< Create a new category.
router.get('/categories', AuthMiddlewares.isAuthorized, CategoryController.retrieveCategories); ///< Retrieve all categories.
router.get('/categories/:categoryId', AuthMiddlewares.isAuthorized, CategoryController.retrieveCategory); ///< Retrieve a specific category by ID.
router.put('/categories/:categoryId', AuthMiddlewares.isAuthorized, CategoryController.updateCateogry); ///< Update a specific category by ID.
router.delete('/categories/:categoryId', AuthMiddlewares.isAuthorized, CategoryController.deleteCateogry); ///< Delete a specific category by ID.
router.delete('/categories', AuthMiddlewares.isAuthorized, CategoryController.deleteAllCategories); ///< Delete all categories.

// Exporting the router to be used in the main application
export default router;
