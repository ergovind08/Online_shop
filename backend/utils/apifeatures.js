class ApiFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.querystr };

    // Remove standard fields and prepare for range search
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    // Handle price range search
    if (queryCopy.minPrice || queryCopy.maxPrice) {
      queryCopy.price = {};

      // Add $gte and $lte conditions based on provided minPrice and maxPrice
      if (queryCopy.minPrice) {
        queryCopy.price.$gte = parseFloat(queryCopy.minPrice);
        delete queryCopy.minPrice; // Remove minPrice from queryCopy
      }
      if (queryCopy.maxPrice) {
        queryCopy.price.$lte = parseFloat(queryCopy.maxPrice);
        delete queryCopy.maxPrice; // Remove maxPrice from queryCopy
      }
    }

    // Convert queryCopy to MongoDB query format
    let mongoQuery = JSON.stringify(queryCopy);
    mongoQuery = mongoQuery.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // Parse the JSON string back to an object and apply to 'query'
    this.query = this.query.find(JSON.parse(mongoQuery));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) | 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
