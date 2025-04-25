/**
 * @file routes.js
 * @brief Express router for MindReveal API.
 * 
 * This file defines the routes for the MindReveal API, handling user authentication, 
 * thoughts management, and categories management using Express.
 */

// Importing necessary modules
import { Router } from "express"; ///< Importing Router from Express for route handling.
import { register, login } from "../auth/auth.js"; ///< Importing UserController for user-related operations.
import ThoughtController from "../controllers/ThoughtsController.js"; ///< Importing ThoughtController for thought-related operations.
import { authenticate, getToken } from "../auth/authenticate.js"; ///< Importing authentication middlewares.
import CategoryController from "../controllers/CategoryController.js"; ///< Importing CategoryController for category-related operations.
import { authorize } from "../auth/authorize.js";
import { getUsers } from "../controllers/adminController.js";
// Creating a new router instance
const router = Router();

/**
 * @section Auth Endpoints
 * 
 * This section handles user authentication related operations.
 */
router.post('/register', register); ///< Endpoint for user registration.
router.post('/login', login); ///< Endpoint for user login.
router.post('/token', getToken)

/**
 * @section Admin Endpoints
 * 
 * This section handles operations related to admin.
 */

router.get('/users', authenticate, authorize, getUsers);

/**
 * @section Thoughts Endpoints
 * 
 * This section handles operations related to user thoughts.
 */
router.post('/thoughts', authenticate, ThoughtController.addThought); ///< Add a new thought.
router.get('/thoughts', authenticate, ThoughtController.getThoughts); ///< Retrieve all thoughts.
router.put('/thoughts/:thoughtId', authenticate, ThoughtController.updateThought); ///< Update a specific thought.
router.delete('/thoughts/:thoughtId', authenticate, ThoughtController.deleteThought); ///< Delete a specific thought.
router.delete('/thoughts', authenticate, ThoughtController.deleteAllThoughts); ///< Delete all thoughts.
router.get('/thoughts/search', authenticate, ThoughtController.searchThoughts); ///< Search for thoughts.
router.get('/thoughts/:thoughtId', authenticate, ThoughtController.getOneThought) ///< Retrieve one thought of a sepcific id.

/**
 * @section Categories Endpoints
 * 
 * This section handles operations related to categories.
 */
router.post('/categories', authenticate, CategoryController.createCateogry); ///< Create a new category.
router.get('/categories', authenticate, CategoryController.retrieveCategories); ///< Retrieve all categories.
router.get('/categories/:categoryId', authenticate, CategoryController.retrieveCategory); ///< Retrieve a specific category by ID.
router.put('/categories/:categoryId', authenticate, CategoryController.updateCateogry); ///< Update a specific category by ID.
router.delete('/categories/:categoryId', authenticate, CategoryController.deleteCateogry); ///< Delete a specific category by ID.
router.delete('/categories', authenticate, CategoryController.deleteAllCategories); ///< Delete all categories.

// Exporting the router to be used in the main application
export default router;
