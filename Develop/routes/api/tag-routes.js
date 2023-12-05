const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  
  // find all tags
  // be sure to include its associated Product data
  try{
    const userData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    if (!userData) {
      res.status(404).json({ message: 'There are no tags in the database!' });
      return;
    }
   res.status(200).json(userData)
  } catch (err) {
    res.status(500).json(err)

  };
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const userData = await Tag.findByPk(req.params.id,{
      include: [{ model: Product, through: ProductTag }]
    });
    if (!userData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    };
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  /*
  The request body should look like this
  {
      tag_name: "swede"
  }
  */
  try {
    const doubleCheck = await Tag.findAll({where:{tag_name:req.body.tag_name}})
    console.log(doubleCheck);
    console.log(doubleCheck.length)
    if(doubleCheck.length > 0){
      res.status(404).json({ message: 'This tag already exists!' });
      return
    } else {
      const userData = await Tag.create(req.body);
      if(!userData) {
        res.status(404).json({ message: 'No tag could be created!' });
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
  // update a tag's name by its `id` value
  /*
  {
    category_name:"Coats"
  }
  */
 try {
  console.log(req.body);
  const doubleCheck = await Tag.findAll({
    where:{tag_name:req.body.tag_name}
  });
  console.log(doubleCheck.length)
  if(doubleCheck.length > 0){
    res.status(404).json({ message: 'The tag you wish to insert already exists!' });
    return
  } else {
    const userData = await Tag.update(req.body, {
      where: {id: req.params.id}
      });
    if (!userData) {
      res.status(404).json({ message: 'The tag you wish to update does not exist!' });
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
  // delete on tag by its `id` value
  try {
    const userData = await Tag.findByPk(req.params.id);
    console.log(userData);
    if (!userData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    };
    const destoryProductTag = await ProductTag.destroy({where: {tag_id:req.params.id}});
    const destroyData = await Tag.destroy({where: {id:req.params.id}})
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
