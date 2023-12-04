const router = require('express').Router();
const { ProductTag } = require('../../models');

router.get('/', async (req, res) => {
    try{
        const userData = await ProductTag.findAll({
        });
        if (!userData) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
        }
       res.status(200).json(userData)
      } catch (err) {
        res.status(500).json(err)
    
      };
  });

  module.exports = router;
  