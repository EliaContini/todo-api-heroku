/**
 * @module app
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Todos REST API
 *
 */

const fastify = require("fastify");
const queryStringParser = require("./queryStringParser");

function build(opts = {}) {
   const app = fastify(opts);
   const db = opts.db;

   app.get("/", async (request, reply) => {
      return reply.send({ message: "Todos REST API is running" });
   });

   app.get("/todos", async (request, reply) => {
      const params = queryStringParser(request.query);

      let todos = [];
      if (params != null) {
         todos = await db.get(params);
      }

      return reply.send(todos);
   });

   app.get("/todos/:id", async (request, reply) => {
      const todoId = request.params.id;

      const todo = await db.get({ id: todoId });

      if (todo == null) {
         return reply
            .status(404)
            .send({ message: `Todo with id ${todoId} not found` });
      }

      return reply.send(todo);
   });

   app.post("/todos", async (request, reply) => {
      const todo = request.body;

      const saved = await db.create(todo);

      return reply.status(201).send(saved);
   });

   app.put("/todos/:id", async (request, reply) => {
      const todo = request.body;

      const updated = await db.update(todo);

      return reply.send(updated);
   });

   app.delete("/todos/:id", async (request, reply) => {
      const todoId = request.params.id;

      const removed = await db.remove(todoId);

      return reply.status(204).send();
   });

   return app;
}

module.exports = build;
