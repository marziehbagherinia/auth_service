const express = require( 'express' );
const AuthController = require( '../controllers/auth.controller' );
const AuthMiddleware = require( '../middlewares/auth.middleware' );
const AdminAuthMiddleware = require( '../middlewares/admin.auth.middleware' );

const router = express.Router();

// /auth/signin => request OTP
router.post( '/signin', AuthController.signIn );

// /auth/verify => verify OTP
router.post( '/verify', AuthController.verify );

// /auth/check => check token validity
router.get( '/check', AuthMiddleware, AuthController.checkToken );

// /auth/check-admin => check admin token validity
router.get( '/check-admin', AdminAuthMiddleware, AuthController.checkAdmin );

// /auth/logout => logout
router.post( '/logout', AuthMiddleware, AuthController.logout );

module.exports = router;
