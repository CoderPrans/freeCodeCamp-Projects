const express = require('express');
const router = express.Router();

router.get('/:date', (req, res) => {
  let date = req.params.date;
  if (new Date(date).toUTCString() !== 'Invalid Date') {
    res.json({
      unix: new Date(date).getTime(),
      utc: new Date(date).toUTCString(),
    });
  } else {
    if (
      new Date(parseInt(date)).toUTCString() !== 'Invalid Date' &&
      date.indexOf('-') < 0
    ) {
      res.json({
        unix: new Date(parseInt(date)).getTime(),
        utc: new Date(parseInt(date)).toUTCString(),
      });
    } else {
      res.json({
        error: 'Invalid Date',
      });
    }
  }
});

module.exports = router;
