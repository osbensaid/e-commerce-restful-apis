class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // Filtering Feature.
  filter() {
    const queryStringObj = { ...this.queryString };
    ["page", "limit", "skip", "sortBy", "fields", "keyword"].forEach(
      (item) => delete queryStringObj[item]
    );

    const filterFormatter = JSON.parse(
      JSON.stringify(queryStringObj).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    );

    this.mongooseQuery = this.mongooseQuery.find(filterFormatter);

    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sortBy) {
      const sortOrder = this.queryString.sortBy.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortOrder);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // Fields limiting
  limitFields() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  // Search
  search(modelName) {
    if (this.queryString.keyword) {
      const searchQuery =
        modelName === "Products"
          ? {
              $or: [
                { title: { $regex: this.queryString.keyword, $options: "i" } },
                {
                  description: {
                    $regex: this.queryString.keyword,
                    $options: "i",
                  },
                },
              ],
            }
          : { name: { $regex: this.queryString.keyword, $options: "i" } };

      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  // Pagination
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }

    // preview page
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
