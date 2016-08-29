var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('test', { title: 'Test' });
});

router.get('/aa', function(req, res, next) {
  res.render('test', { title: 'Testaa' });
});

module.exports = router;


var a = {};
a['d']='bbb';
var b = {a:a};
console.log(a.a);
console.log(b);