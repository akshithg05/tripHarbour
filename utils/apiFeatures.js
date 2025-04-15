class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Api Feature for filtering
  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Return the entire object APIFeatures
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt'); // default sort property
    }
    return this;
  }

  limitFields() {
    // 3) Selecting and Limiting fields (projecting)

    if (this.queryString.fields) {
      const limitedFields = this.queryString.fields.split(',').join(' ');
      this.query.select(limitedFields);
    } else {
      this.query.select('-__v'); // '-' means exclude the '__v' field
    }

    return this;
  }

  paginate() {
    // 4) Pagination

    const page = this.queryString.page * 1 || 1; //deafult page 1
    const limit = this.queryString.limit * 1 || 100; // default results per page 100
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
