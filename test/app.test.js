/**
 * @module app.test
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Test for app module
 *
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { test } = require("tap");

const build = require("./../app");
const storage = require("./../storage");

const mongoServer = new MongoMemoryServer();
mongoose.Promise = Promise;

test("", async (t) => {
   return mongoServer.getUri().then((mongoUri) => {
      const db = storage(mongoUri);

      //#region ------------------------------- ------------------------ route /
      t.test('The route "/"', async (t) => {
         const app = build();

         const response = await app.inject({
            method: "GET",
            url: "/",
         });

         t.strictEqual(
            response.statusCode,
            200,
            "returns a status code of 200"
         );
      });

      t.test('The route "/"', async (t) => {
         const app = build();

         const response = await app.inject({
            method: "GET",
            url: "/",
         });

         t.strictEqual(
            response.headers["content-type"],
            "application/json; charset=utf-8",
            'returns a "Content-Type" equal to "application/json; charset=utf-8"'
         );
      });

      t.test('The route "/"', async (t) => {
         const app = build();

         const response = await app.inject({
            method: "GET",
            url: "/",
         });

         const expected = { message: "Todos REST API is running" };

         t.deepEqual(
            response.json(),
            expected,
            'returns the message "Todos REST API is running"'
         );
      });
      //#endregion -------------------------------------------------------------

      //#region --------------------------------------------------- route /todos
      t.test('The route "/todos"', async (t) => {
         const app = build();

         const response = await app.inject({
            method: "GET",
            url: "/todos",
         });

         t.deepEqual(response.json(), [], "returns an empty array");
      });

      t.test('The route "/todos?sort-by=createdAt.asc"', async (t) => {
         const app = build({ db: db });

         const response = await app.inject({
            method: "GET",
            query: {
               "sort-by": "createdAt.asc",
            },
            url: "/todos",
         });

         t.deepEqual(response.json(), [], "returns an empty array");
      });

      t.test('A POST request to "/todos"', async (t) => {
         const app = build({ db: db });

         const todo = {
            text: "My first todo",
         };

         const response = await app.inject({
            body: todo,
            method: "POST",
            url: "/todos",
         });

         t.strictEqual(response.json().text, todo.text, "creates a new todo");
      });

      t.test('A POST request to "/todos"', async (t) => {
         const app = build({ db: db });

         const todo = {
            text: "My first todo",
         };

         const response = await app.inject({
            body: todo,
            method: "POST",
            url: "/todos",
         });

         t.strictEqual(
            response.statusCode,
            201,
            "returns a status code of 201"
         );
      });

      t.test('A PUT request to "/todos/:id"', async (t) => {
         const app = build({ db: db });

         const todo = {
            text: "My first todo",
         };

         const responseCreate = await app.inject({
            body: todo,
            method: "POST",
            url: "/todos",
         });

         let todoEdited = responseCreate.json();
         todoEdited.state = "done";
         todoEdited.text = "Edited todo";

         const responseUpdate = await app.inject({
            body: todoEdited,
            method: "PUT",
            url: "/todos/" + todoEdited._id,
         });

         t.strictEqual(
            responseUpdate.statusCode,
            200,
            "returns a status code of 200"
         );
      });

      t.test('A GET request to "/todos/:id"', async (t) => {
         const app = build({ db: db });

         const todo = {
            text: "My first todo",
         };

         const responseCreate = await app.inject({
            body: todo,
            method: "POST",
            url: "/todos",
         });

         const responseGet = await app.inject({
            method: "GET",
            url: "/todos/" + responseCreate.json()._id,
         });

         t.strictEqual(
            responseGet.json()._id,
            responseCreate.json()._id,
            "returns the todo with id equal to :id"
         );
      });

      t.test('A GET request to "/todos/:invalidId"', async (t) => {
         const app = build({ db: db });

         const responseGet = await app.inject({
            method: "GET",
            url: "/todos/",
         });

         t.strictEqual(
            responseGet.statusCode,
            404,
            "returns a status code of 404"
         );
      });

      t.test('A DELETE request to "/todos/:id"', async (t) => {
         const app = build({ db: db });

         const todo = {
            text: "Todo do be deleted",
         };

         const responseCreate = await app.inject({
            body: todo,
            method: "POST",
            url: "/todos",
         });

         const responseRemove = await app.inject({
            body: todo,
            method: "DELETE",
            url: "/todos/" + responseCreate.json()._id,
         });

         t.strictEqual(
            responseRemove.statusCode,
            204,
            "returns a status code of 204"
         );
      });
      //#endregion -------------------------------------------------------------

      t.tearDown(async () => {
         db.close();

         mongoServer.stop();
      });
   });
});
