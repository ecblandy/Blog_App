const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


// Model usuario
require('../models/usuario')
const Usuario = mongoose.model('usuarios')


module.exports = (passport) => {
    passport.use(new localStrategy({
        usernameField: 'email',
    }, (email, password, done) => {
        Usuario.findOne({email}).then(user => {
            if(!user){
                return done(null, false, {message: 'Está conta não existe'})
            }

            bcrypt.compare(password, user.password, (erro, equal) => {
                if(equal){
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Senha incorreta.'})
                }
            })
        }).catch(error => console.log(error))
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Usuario.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    
    })
}