const router = require('express').Router();
const ctrl   = require('../controllers/categoryController');
router.post('/',      ctrl.create);
router.get('/',       ctrl.findAll);
router.get('/:id',    ctrl.findById);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.remove);
module.exports = router;
