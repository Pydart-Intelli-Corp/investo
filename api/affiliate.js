const express = require('express');
const router = express.Router();

// Affiliate routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Affiliate routes - coming soon' });
});

module.exports = router;