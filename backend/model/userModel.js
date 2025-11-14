const {model} = require('mongoose');
const {UserSchema} = require('../schemas/userSchema');
const bcrypt = require('bcrypt');

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model("user", UserSchema);
module.exports = {UserModel};