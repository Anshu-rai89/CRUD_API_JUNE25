const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
},{
    timestamps: true
});


const ProductSchema = mongoose.model('Post-JuneBatch', postSchema);

module.exports = ProductSchema;