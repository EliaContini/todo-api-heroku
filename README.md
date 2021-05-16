# A simple REST API to manage todos using Fastify, MongoDB and Heroku

This solution uses [Fastify](https://www.fastify.io/), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and it is configured to be deployed on [Heroku](https://www.heroku.com/).

You can read more details about the implementation in my [blog post](https://elia.contini.page/blog/fastify-mongodb-heroku-rest-api/).

## Install dependencies

    $ npm install

## Configure MongoDB URI for local development

Copy `sample.env` in `.env` and edit with your MONGODB_URI.

## Run the server

    $ npm start

The server listens to connections at http://localhost:3000

## Run the tests

    $ npm test

## Deployment on Heroku

Login with your Heroku account

    $ heroku login

Create the app

    $ heroku create

Set environment variable with MongoDB Atlas connection string

    $ heroku config:set MONGO_DB_URI="mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<db-name>"

Deploy

    $ git push heroku master

