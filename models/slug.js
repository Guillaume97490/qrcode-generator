const mongoose = require('../config/database');

let SlugShema = mongoose.Schema({
    url: {type: String, required: true},
    // slug: {type: String, required: true}
});
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

SlugShema.plugin(autoIncrement.plugin, 'Slug');
let Slug = mongoose.model('Slug', SlugShema);

module.exports = Slug;