const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
const producttagRoutes = require('./product-tag-routes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);
router.use('/product-tags', producttagRoutes);

module.exports = router;
