module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      author: String,
      pages: Number,
      isbn: String,
    },
    { timestamps: true }
  );

  // rename _id to id when converting to JSON
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const findOrCreate = require('mongoose-findorcreate')
  schema.plugin(findOrCreate);

  return mongoose.model("Book", schema);
}
