const { Schema, model } = require('mongoose');

const UserSchema = Schema({

    email: {
        type: String,
        require: true,
        unique: true
    },

    name: {
        type: String,
        require: true
    },

    phone: {
        type: String
    },

    empresa: {
        type: String
    },

    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'ADMIN',
        require: true
    },

    img: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

UserSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;

});

module.exports = model('User', UserSchema);