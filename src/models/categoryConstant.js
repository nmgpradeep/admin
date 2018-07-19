const categoryConstant = {
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
    default: 0
  }
};
module.exports = categoryConstant;
