const router = require('express').Router();
const { ProductTag } = require('../../models');

router.get('/', async (req, res) => {
    // find all categories
    // be sure to include its associated Products
    try{
      const userData = await ProductTag.findAll({
      });
      if (!userData) {
        res.status(404).json({ message: 'No Product Tags' });
        return;
      }
     res.status(200).json(userData)
    } catch (err) {
      res.status(500).json(err)
  
    };
  });

  module.exports = router;
  