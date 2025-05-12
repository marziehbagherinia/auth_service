const express = require( 'express' );
const HealthController = require( '../controllers/health.controller' );

const router = express.Router();

// GET /health
router.get( '/', HealthController.checkHealth );

module.exports = router;
