const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productDbData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        { model: Category, attributes: ['category_name'] },
        { model: Category, attributes: ['category_name'] }
      ]
    });
    if (productDbData.length === 0) {
      return res.status(400).json('No products were found');
    }
    return res.json(productDbData);
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productDbData = await Product.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        { model: Category, attributes: ['category_name'] },
        { model: Tag, attributes: ['tag_name'] }
      ]
    });
    if (!productDbData) {
      return res.status(404).json('No products were found with that id.');
    }
    return res.json(productDbData);
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal server error');
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds
    });
    if (req.body.tagIds.length > 0) {
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: product.id,
        tag_id
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    return res.status(201).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal server error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    const productTagIds = productTags.map(tag => tag.tag_id);
    const newProductTags = req.body.tagIds
      .filter(tag_id => !productTagIds.includes(tag_id))
      .map(tag_id => ({ product_id: req.params.id, tag_id }));
    const productTagsToRemove = productTags
      .filter(tag => !req.body.tagIds.includes(tag.tag_id))
      .map(tag => tag.id);
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags)
    ]);
    return res.status(200).json('Product updated successfully');
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal server error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteProductDbData = await Product.destroy({ where: { id: req.params.id } });
    if (deleteProductDbData === 0) {
      return res.status(404).json('No products were found with that id.');
    }
    return res.status(200).json(`Product with id ${req.params.id} deleted successfully`);
  } catch (


module.exports = router;
