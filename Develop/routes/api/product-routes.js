const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try{
    const userData = await Product.findAll({
      include: [{ model: Category},{model: Tag, through: ProductTag}]
    });
    if (!userData) {
      res.status(404).json({ message: 'There are no prodcuts!' });
      return;
    }
   res.status(200).json(userData)
  } catch (err) {
    res.status(500).json(err)

  };
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const userData = await Product.findByPk(req.params.id,{
      include: [{ model: Category},{model: Tag, through: ProductTag}]
    });
    if (!userData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    };
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 4,
      tag_id: [1, 2, 3, 4] <- MUST BE AN ARRAY
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      console.log(req.body.tag_id.length);
      console.log(req.body.tag_id);
      if (req.body.tag_id.length) {
        const productTagIdArr = req.body.tag_id.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id, //This was a little busted?
          };
        });
        console.log(productTagIdArr);
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
 Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tag_id && req.body.tag_id.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tag_id
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tag_id.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const userData = await Product.findByPk(req.params.id);
    console.log(userData);
    if (!userData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    };
    const destoryProductTag = await ProductTag.destroy({where: {product_id:req.params.id}});
    const destroyData = await Product.destroy({where: {id:req.params.id}})
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
