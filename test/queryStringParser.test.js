/**
 * @module queryStringParser.test
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Test for queryStringParser module
 *
 */

const { test } = require("tap");

const queryStringParser = require("./../queryStringParser");

test("sort-by=createdAt.asc", async (t) => {
   const params = queryStringParser({ "sort-by": "createdAt.asc" });

   const expected = {
      sortBy: {
         isDescending: false,
         property: "createdAt",
      },
   };

   t.deepEqual(params, expected);
});

test("sort-by=updatedAt.desc", async (t) => {
   const params = queryStringParser({ "sort-by": "updatedAt.desc" });

   const expected = {
      sortBy: {
         isDescending: true,
         property: "updatedAt",
      },
   };

   t.deepEqual(params, expected);
});

test("state=done", async (t) => {
   const params = queryStringParser({ state: "done" });

   const expected = {
      isCompleted: true,
   };

   t.deepEqual(params, expected);
});

test("state=todo", async (t) => {
   const params = queryStringParser({ state: "todo" });

   const expected = {
      isCompleted: false,
   };

   t.deepEqual(params, expected);
});

test("invalid=1", async (t) => {
   const params = queryStringParser({ invalid: 1 });

   t.deepEqual(params, null);
});
