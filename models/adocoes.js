const mongoose = require('mongoose');

const adocaoSchema = new mongoose.Schema({
    id_adotante: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuarios', 
        required: true 
    },
    id_pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'pets', 
        required: true 
    },
    data_adocao: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['pendente', 'finalizada', 'cancelada'], 
        default: 'pendente' 
    }
});

const Adocao = mongoose.model('adocoes', adocaoSchema);

module.exports = Adocao;
