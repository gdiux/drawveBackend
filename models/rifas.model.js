const { Schema, model } = require('mongoose');

const ImgSchema = Schema({

    img: {
        type: String
    },

    fecha: {
        type: Date,
        default: Date.now()
    }

});

const MetodosSchema = Schema({

    name: {
        type: String
    },

    descripcion: {
        type: String
    },

    cuenta: {
        type: String
    }

});

const PremiosSchema = Schema({

    name: {
        type: String
    },

    descripcion: {
        type: String
    },

    fecha: {
        type: Date
    }

});

const RifasSchema = Schema({

    name: {
        type: String,
        require: true,
    },

    monto: {
        type: Number,
        require: true,
    },

    numeros: {
        type: Number,
        require: true,
    },

    loteria: {
        type: String,
        require: true,
    },

    fecha: {
        type: Date,
        require: true,
    },

    descripcion: {
        type: String,
        require: true,
    },

    metodos: [MetodosSchema],

    premios: [PremiosSchema],

    img: [ImgSchema],

    estado: {
        type: String,
        default: 'Pendiente'
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    abierta: {
        type: Boolean,
        default: true
    },

    status: {
        type: Boolean,
        default: true
    },

});

RifasSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.rifid = _id;
    return object;

});

module.exports = model('Rifas', RifasSchema);