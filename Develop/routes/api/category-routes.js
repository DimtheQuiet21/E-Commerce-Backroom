const router = require('express').Router();
const { Category, Product } = require('../../models');
const { findAll } = require('../../models/Product');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const userData = await Category.findAll({
      include: [{ model: Product }],
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

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const userData = await Category.findByPk(req.params.id);
    if (!userData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    };
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  /*
  The request body should look like this
  {
      category_name: "Jacket"
  }
  */
  try {
    const doubleCheck = await Category.findAll({where:{category_name:req.body.category_name}})
    console.log(doubleCheck);
    console.log(doubleCheck.length)
    if(doubleCheck.length > 0){
      res.status(404).json({ message: 'This category already exists!' });
      return
    } else {
      const userData = await Category.create(req.body);
      if(!userData) {
        res.status(404).json({ message: 'No category could be created!' });
        return
      }
      res.status(200).json(userData);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  /* update a category by its `id` value
  request body should look like
  {
    category_name:"Coats"
  }
  */
 try {
  console.log(req.body);
  const doubleCheck = await Category.findAll({
    where:{category_name:req.body.category_name}
  });
  console.log(doubleCheck.length)
  if(doubleCheck.length > 0){
    res.status(404).json({ message: 'The category you wish to insert already exists!' });
    return
  } else {
    const userData = await Category.update(req.body, {
      where: {id: req.params.id}
      });
    if (!userData) {
      res.status(404).json({ message: 'The category you wish to update does not exist!' });
      return
    };
    console.log(userData);
    res.status(200).json(userData);
  };
} catch (err) {
  console.log(err);
  res.status(400).json(err);
 } 
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const userData = await Category.findByPk(req.params.id);
    console.log(userData);
    if (!userData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    };
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
