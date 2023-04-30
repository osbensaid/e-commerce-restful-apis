const ApiError = require("../libraries/apiErrors");
const ApiFeatures = require("../libraries/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json(document);
  } catch (error) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  } catch (error) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
};
