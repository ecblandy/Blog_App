const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/usuario')
const Usuario = mongoose.model('usuarios')
const bcypt = require('bcryptjs')
const passport = require('passport')
// Pagina de registro.
router.get('/registro', (req, res) => {
  res.render('usuarios/registro')
})

// Cadastro.
router.post('/registro', (req, res) => {
  let erros = []
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const passwordConfirmation = req.body.passwordConfirmation

  // Validações
  if (!name || typeof name === undefined || typeof name === null) {
    erros.push({ text: 'Nome inválido.' })
  }

  if (!email || typeof email === undefined || typeof email === null) {
    erros.push({ text: 'Email inválido.' })
  }

  if (!password || typeof password === undefined || typeof password === null) {
    erros.push({ text: 'Senha inválida.' })
  }

  if (password.length < 4) {
    erros.push({ text: 'Senha muito curta' })
  }

  if (password !== passwordConfirmation) {
    erros.push({ text: 'As senhas são diferentes tente novamente' })
  }

  if (erros.length > 0) {
    res.render('usuarios/registro', { erros })
  } else {
    // Cadastro de usuarios e verificação se ja existe email no sistema.
    Usuario.findOne({ email: email })
      .then((usuario) => {
        if (usuario) {
          req.flash(
            'error_msg',
            'Ja existe uma conta com esse email no nosso sistema.'
          )
          res.redirect('/usuarios/registro')
        } else {
          const novoUsuario = new Usuario({
            name,
            email,
            password
          })

          bcypt.genSalt(10, (error, salt) => {
            // 3 parametros
            bcypt.hash(novoUsuario.password, salt, (erro, hash) => {
              if (error) {
                req.flash(
                  'error_msg',
                  'Houve um erro durante o salvamento do usuario.'
                )
                res.redirect('/')
              }

              novoUsuario.password = hash
              novoUsuario
                .save()
                .then(() => {
                  console.log('erro ao salvar')
                  req.flash('success_msg', 'Usuario cadasrado com sucesso.')
                  res.redirect('/')
                })
                .catch(() => {
                  req.flash(
                    'error_msg',
                    'Houve um erro ao cadastrar o usuario.'
                  )
                  res.redirect('/usuarios/registro')
                })
            })
          })
        }
      })
      .catch(() => {
        req.flash('error_msg', 'Houve um erro interno.')
        res.redirect('/')
      })
  }
})

// Login
router.get('/login', (req, res) => {
  res.render('usuarios/login')
})

// Login confirmado.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error_msg', 'Houve um erro ao deslogar.')
      res.redirect('/')
    }

    req.flash('success_msg', 'Deslogado com sucesso.')
    res.redirect('/')
  })
})

module.exports = router
