const express = require('express');
const router = express.Router();

// Transaction routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Transaction routes - coming soon' });
});

module.exports = router;