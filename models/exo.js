const mongoose = require('../config/database');

let exoSchema = mongoose.Schema({
    url: {type: String, required: true},
    nom: {type: String, required: true}
});
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

exoSchema.plugin(autoIncrement.plugin, 'Exo');
let Exo = mongoose.model('Exo', exoSchema);

module.exports = Exo;