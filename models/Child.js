const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const childSchema = new Schema({
    name: String,
    dob: Date,
    image: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'}, 
    postings: [{type: Schema.Types.ObjectId, ref: 'Posting'}]
})

const childModel = mongoose.model('Child', childSchema)
//mongoose expects the name of the model to be singular and havea capital first letter
//name of the collection in DB will be called celebrities with lower case C because mongoose will do it by magic

module.exports = childModel;