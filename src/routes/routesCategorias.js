const express = require('express');
const router = express.Router();

router.get('/nuevaCategoria', (req, res) => {
    res.render('nuevaCategoria');
});

module.exports = router;