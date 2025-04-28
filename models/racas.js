const mongoose = require('mongoose');

const racaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    tipo: { type: String, required: true },
});

const Raca = mongoose.model('racas', racaSchema);

module.exports = Raca;
