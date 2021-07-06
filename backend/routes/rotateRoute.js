const express = require('express');
const router = express.Router();
var Rotator = require('./Rotator.js');

router.post('/imageRotate', async (req, res) => {
  const { image, angle } = req.body;
  console.log(image.data);
  console.log(image.height);
  console.log(image.width);
  let rotator = new Rotator();
  let endResult = rotator.rotate(image, angle);
  res.json(endResult);
});

module.exports = router;
