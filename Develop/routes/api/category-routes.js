const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      },
    });
    if (!categories) {
      return res.status(404).json({ message: 'No categories were found' });
    }
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      },
    });
    if (!category) {
      return res.status(404).json({ message: 'No category found with this id' });
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  // create a new category
    try {
      const category = await Category.create({
        category_name: req.body.category_name,
      });
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.put('/:id', (req, res) => {
  // update a category by its `id` value

    try {
      const [numRowsUpdated, [updatedCategory]] = await Category.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });
      if (numRowsUpdated === 0) {
        return res.status(404).json({ message: 'No category found with this id' });
      }
      res.json(updatedCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
    try {
      const numRowsDeleted = await Category.destroy({ where: { id: req.params.id } });
      if (numRowsDeleted === 0) {
        return res.status(404).json({ message: 'No category found with this id' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
