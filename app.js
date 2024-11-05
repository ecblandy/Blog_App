const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const { create, ExpressHandlebars } = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const hbs = create({ defaultLayout: 'main' })
const path = require('path')
require('./models/Postagem')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')
require('./models/usuario')
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)
require('dotenv').config()
const { connectAtlas } = require('./config/db')

// Configuração
// Sessão
app.use(
  session({
    secret: 'blogapp',
    resave: true,
    saveUninitialized: true
  })
)
// Passport
app.use(passport.initialize())
app.use(passport.session())
// Flash
app.use(flash())
// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') // Serve pra criar variaveis globais
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null

  next() // Segue em frente
})
// BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Handlebars
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')
// Mongoose
mongoose.Promise = global.Promise
connectAtlas()
// Public
app.use(express.static(path.join(__dirname, 'public')))

// Rotas
app.get('/', (req, res) => {
  Postagem.find()
    .populate('categoria')
    .sort({ data: 'desc' })
    .lean()
    .then((postagens) => {
      res.render('index', { postagens })
    })
    .catch(() => {
      req.flash('error_msg', 'Houve um erro interno.')
      res.redirect('/404')
    })
})

// Pagina de erro
app.get('/404', (req, res) => {
  res.send('erro 404')
})
//  Postagem completa (Leia mais)
app.get('/postagem/:slug', (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .lean()
    .then((postagem) => {
      if (postagem) {
        res.render('postagem/index', { postagem })
      } else {
        req.flash('error_msg', 'Está postagem não existe.')
        res.redirect('/')
      }
    })
    .catch(() => {
      req.flash('error_msg', 'Houve um erro interno.')
      res.redirect('/')
    })
})

//
app.get('/categorias', (req, res) => {
  Categoria.find()
    .lean()
    .then((categorias) => {
      res.render('categorias/index', { categorias })
    })
    .catch(() => {
      req.flash('error_msg', 'Houve um erro ao listar categorias.')
      res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res) => {
  Categoria.findOne({ slug: req.params.slug })
    .lean()
    .then((categoria) => {
      if (categoria) {
        Postagem.find({ categoria: categoria._id })
          .lean()
          .then((postagens) => {
            console.log('Oi', categoria)
            res.render('categorias/postagens', { postagens, categoria })
          })
          .catch(() => {
            req.flash('error_msg', 'Houve um erro ao listar os posts.')
            res.redirect('/')
          })
      } else {
        req.flash('error_msg', 'Esta categoria não existe.')
        res.redirect('/')
      }
    })
    .catch(() => {
      req.flash(
        'error_msg',
        'Houve um erro interno ao carregar a pagina dessa categoria.'
      )
      res.redirect('/')
    })
})

// Chamando grupo de rotas
app.use('/admin', admin)
app.use('/usuarios', usuarios)

// Servidor
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log('Porta iniciada em localhost:4000')
})
