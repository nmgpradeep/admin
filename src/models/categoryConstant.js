const categoryConstant = {
   id: {
    type: Number,
    index: true,
    required: true,
    auto: true,
    default: 1
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parent: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true,
    sparse: true,
    default: 1
  }
};
module.exports = categoryConstant;
