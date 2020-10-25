module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        username: {type: String, unique: true, required: true },
        password: {type: String, required: true },
        names: String,
        phone: String,
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
  
    return mongoose.model("User", schema);
  }
  