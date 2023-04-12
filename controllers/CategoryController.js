const { sulgify } = require("../Libraries/Slugify");
const CategoryModel = require("../models/categoryModel");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  try {
    const categories = await CategoryModel.find({})
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({ results: categories.length, page, data: categories });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = async (req, res) => {
  const name = req.body.name;
  const slug = sulgify(name);

  try {
    await CategoryModel.create({
      name: name,
      slug: slug,
    }).then((doc) => res.status(201).json(doc));
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      res.status(404).json("");
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(400).send({ msg: `No category for this ${categoryId}` });
  }
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const slug = sulgify(name);

  try {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: categoryId },
      { name, slug },
      { new: true }
    );
    if (!category) {
      res.status(404).json({ msg: `No category for this ${categoryId}` });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(400).send({ msg: `No category for this ${categoryId}` });
  }
};

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  const category = await CategoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    res.status(404).json({ msg: `No category for this ${categoryId}` });
  }
  res.status(200).json();
};
