module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      number: String,
      email: String,
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

  return mongoose.model("Contact", schema);
}
