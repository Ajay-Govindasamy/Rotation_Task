const express = require('express');
const router = express.Router();
var Rotator = require('./rotatorAlgorithm.js');

router.post('/imageRotate', async (req, res) => {
  var someone = new Rotator('First name', 'Last name');
  someone.display();
  return res.status(200).send(req.body.imageData);
});

module.exports = router;
