const { Schema } = require('mongoose')
const shortid = require('shortid')
const { ObjectId } = Schema

const dubSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = db.model('Dub', dubSchema)
