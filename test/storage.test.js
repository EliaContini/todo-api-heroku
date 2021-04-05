/**
 * @module storage.test
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Test for storage module
 *
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { test } = require("tap");

const storage = require("./../storage");

const mongoServer = new MongoMemoryServer();
mongoose.Promise = Promise;

test("", async (t) => {
   return mongoServer.getUri().then((mongoUri) => {
      const db = storage(mongoUri);

      t.test("Get todos", async (t) => {
         const response = await db.get();

         t.deepEqual(response, [], "returns an empty array");
      });

      t.test("Create a todo", async (t) => {
         const todo = {
            text: "My first todo",
         };

         const response = await db.create(todo);

         t.deepEqual(response.text, todo.text, "returns the just created todo");
      });

      t.test("Get uncompleted todos", async (t) => {
         const response = await db.get({ isCompleted: false });

         t.strictEqual(response.length, 1, "returns 1 todo");
      });

      t.test("Set todo completed", async (t) => {
         const responseUncompleted = await db.get({ isCompleted: false });

         let todo = responseUncompleted[0];
         todo.isCompleted = true;

         const response = await db.update(todo);

         t.equal(response.isCompleted, todo.isCompleted);
      });

      t.test("Creates 2 uncompleted todos", async (t) => {
         const todo2 = {
            text: "Todo 2",
         };
         await db.create(todo2);

         const todo3 = {
            text: "Todo 3",
         };
         await db.create(todo3);

         const responseUncompleted = await db.get({ isCompleted: false });

         t.equal(responseUncompleted.length, 2);
      });

      t.test("Sort uncompleted todos by createdAt ascending", async (t) => {
         const response = await db.get({
            isCompleted: false,
            sortBy: {
               isDescending: false,
               property: "createdAt",
            },
         });

         t.equal(response[0].createdAt < response[1].createdAt, true);
      });

      t.test("Sort uncompleted todos by updatedAt descending", async (t) => {
         const response = await db.get({
            isCompleted: false,
            sortBy: {
               isDescending: true,
               property: "updatedAt",
            },
         });

         t.equal(response[0].updatedAt > response[1].updatedAt, true);
      });

      t.test("Remove todo completed", async (t) => {
         const response = await db.get({ isCompleted: true });

         const todo = response[0];

         const removed = await db.remove(todo);

         t.same(removed._id, todo._id, "returns the removed todo");
      });

      t.tearDown(async () => {
         db.close();

         mongoServer.stop();
      });
   });
});
