const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categorias = mongoose.model('categorias') // Importa modelo
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')



// Rota principal
    router.get('/', eAdmin, (req, res) => {
        res.render('admin/index') // Acessa pagina de views, procura pela pasta admin e o arquivo index.
    })
    
    // Lista de categorias
    router.get('/categorias', eAdmin, (req, res) => {
        // Desc => decrecente
        Categorias.find({}).sort({date: 'desc'}).lean().then(categorias => {   
            res.render('admin/categorias', {
                categorias
            })

        }).catch(err => {
            req.flash('error_msg', 'Erro ao criar categoria.')
                res.redirect('/admin')
        })
    })
    // Adiciona nova categoria
    router.get('/categorias/add', eAdmin, (req, res) => {
         res.render('admin/addCategoria')
    })

    // Post nova categoria
    router.post('/categorias/nova', eAdmin, (req, res) => {
        const erros = [] // Array de erros

        const {name, slug} = req.body

        // Validações
        if(!name || typeof name === undefined || name === null){
            erros.push({text: 'Campo da categoria inválido.'})
        }

        if(!slug || typeof slug === undefined || slug === null ){
            erros.push({text: 'slug inválido'})
        }

        if(name.length < 2){
            erros.push({text: 'Nome da categoria muito pequeno'})
        }

        if (erros.length > 0) {
        return res.render('admin/addCategoria', {
            erros: erros
        })

        } else {
        const novaCategoria = {
            name: name,
            slug: slug
        }

        new Categorias(novaCategoria).save() // Instancia modelo e adiciona a categoria
        .then(() => {
            req.flash('success_msg', 'Sucesso ao cadastrar categoria.')
            res.redirect('/admin/categorias')
        })
        .catch(err => {
            req.flash('error_msg', 'Erro ao criar categoria.')
             res.redirect('/')
        })
    }
        
    })
    
    // Rota de Edição de categorias
    router.get('/categorias/edit/:id', eAdmin, (req,res) => {
        Categorias.findOne({_id: req.params.id}).lean()
        .then(categoria => {
            res.render('admin/editCategoria', {categoria})
        })
        .catch(error => {
            req.flash('error_msg', 'está categoria não existe.')
            res.redirect('/admin/categorias')
        })  

    })

    // Rota pra atualizar categorias
    router.post('/categorias/edit', eAdmin, (req,res) => {
        Categorias.findOne({_id: req.body.id}).then(categoria => {

            categoria.name = req.body.name
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso.')
                res.redirect('/admin/categorias')
            }).catch(() => {
                req.flash('error_msg', 'Houve um erro ao editar a categoria')
                res.redirect('/admin/categorias')
            })
        })
        
    })
    // Deleta categoria
    router.post('/categorias/deletar', eAdmin, (req, res) => {
        Categorias.deleteOne({_id: req.body.id})
        .then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso')
            res.redirect('/admin/categorias')
        }).catch(() => {
            req.flash('error_msg', 'Erro ao deletar categoria')
            res.redirect('/admin/categorias')
        })
    })


    // POSTAGEM
    router.get('/postagens', eAdmin, (req, res) => {
        Postagem.find().populate('categoria').sort({data: 'desc'}).lean().then(postagens => {
            res.render('admin/postagens', {postagens})
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao listar as postagens.')
        })
    })

    // ADD POSTAGEM
    router.get('/postagens/add', eAdmin, (req, res) => {
       Categorias.find().lean().then(categorias => {
            res.render('admin/addPostagem', {categorias})
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulario.')
        })
    })

    // NOVA POSTAGEM
    router.post('/postagens/nova', eAdmin, (req, res) => {
        let erros = []

        if(req.body.categoria == 0){
            erros.push({
                text: 'Categoria inválida, registre uma categoria.'
            })
        }

        if(erros.length > 0){
            res.render('admin/addPostagem', {erros})
        } else {
            const novaPostagem = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                slug: req.body.slug
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash('success_msg', 'Sucesso ao cadastrar postagem')
                res.redirect('/admin/postagens')
            }).catch(() => {
                req.flash('error_msg', 'Houve um erro ao salvar a postagem.')
                res.redirect('/admin/postagens')
            })
        }
    })

    // Edita postagem
    router.get('/postagens/edit/:id', eAdmin, (req, res) => {
        Postagem.findOne({_id: req.params.id}).lean().then(postagem => {
            Categorias.find().lean().then(categoria => {
                res.render('admin/editPostagens', {categoria, postagem})
            }).catch(() => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias.')
                res.redirect('/admin/postagens')
            })


        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição.')
            res.redirect('admin/postagens')
        })
       
    })

    // Salva postagem
    router.post('/postagem/edit', eAdmin, (req, res) => {
        Postagem.findOne({_id: req.body.id}).then(postagem => {

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                console.log('eu sou o then')
                req.flash('success_msg', 'Postagem editada com sucesso')
                res.redirect('/admin/postagens')
            }).catch(() => {
                req.flash('error_msg', 'Erro interno.')
                res.redirect('/admin/postagens')
            })


           

        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao salvar edição')
            res.redirect('/admin/postagens')
        })
    })

    // Deleta postagem
    router.get('/postagens/deletar/:id', eAdmin, (req, res) => {
        Postagem.deleteOne({_id: req.params.id}).then(() => {
            req.flash('success_msg', 'Sucesso ao deletar postagem.')
            res.redirect('/admin/postagens')
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao deletar postagem.')
            res.redirect('/admin/postagens')
        })
    })

module.exports = router
            
 