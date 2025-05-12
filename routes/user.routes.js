const express = require( 'express' );
const UserController = require( '../controllers/user.controller' );
const authMiddleware = require( '../middlewares/auth.middleware' );

const router = express.Router();

// Protected routes
router.use( authMiddleware );

// CRUD
router.get( '/', UserController.index );
router.get( '/:id', UserController.show );
router.put( '/:id?', UserController.update );
router.delete( '/:id', UserController.delete );

module.exports = router;
