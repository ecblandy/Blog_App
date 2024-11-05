# Meu Projeto de Blog - Node.js e Express

Este é um projeto de fullstack de um sistema de blog simples desenvolvido utilizando **Node.js** e **Express**. O projeto conta com funcionalidades de cadastro e login de usuários com **autenticação** e **segurança de senha** utilizando **Passport.js** e **bcrypt**. Além disso, o sistema permite o gerenciamento de **categorias** e **postagens**, com todos os dados sendo armazenados em um banco de dados do **MongoDb**.

## Funcionalidades

- **Cadastro de Usuário**: Permite que novos usuários se cadastrem no sistema.
- **Login e Autenticação**: Utiliza Passport.js para autenticação, com segurança na senha.
- **Gerenciamento de Postagens**: Usuários autenticados como ADM podem criar, editar e excluir postagens.
- **Gerenciamento de Categorias**: Postagens podem ser organizadas em categorias.
- **Segurança**: As senhas dos usuários são armazenadas de forma segura utilizando o passport e bcrypt para hashing.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript no servidor.
- **Express** - Framework web para Node.js.
- **Passport.js** - Middleware de autenticação para Node.js.
- **bcryptjs** - Biblioteca para hash de senhas.
- **MongoDB** - Banco de dados NoSQL para armazenar dados (pode ser substituído por outro banco se necessário).
- **Mongoose** - ODM (Object Data Modeling) para MongoDB e Node.js.
- **express-session** - Middleware para gerenciar sessões de usuário.
- **connect-flash** - Middleware para mensagens flash.
- **express-handlebars** - Template engine para renderização de páginas HTML.
- **nodemon** - Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.
- **passport-local** - Estratégia do Passport para autenticação local.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/usuario/repositorio.git
   cd repositorio

   ```

2. Acesso ao painel de ADM:

## SITE RENDER

- Para acessar basta está na rota padrão https://blog-app-6mun.onrender.com
- Então acesse categorias:
  https://blog-app-6mun.onrender.com/admin/categorias
- Então acesse postagens:
  https://blog-app-6mun.onrender.com/admin/postagens

OBS FINAL: O cadastro de usuarios por padrão, defini todos como ADM para terem acesso a rota de ADM.

[![Projeto BlogApp](/public/img/image.png)](https://blog-app-6mun.onrender.com)

