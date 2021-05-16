/**
 * @module queryStringParser.test
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Test for queryStringParser module
 *
 */

"use strict";

const { test } = require("tap");

const queryStringParser = require("./../queryStringParser");

// #region ------------------------------------------------- null or empty query
test("if query is null,", async (t) => {
   const params = queryStringParser(null);

   t.same(params, null, "returns null");
});

test("if query is {},", async (t) => {
   const params = queryStringParser({});

   t.same(params, null, "returns null");
});
// #endregion ------------------------------------------------------------------

// #region ------------------------------------------------ sort by and order by
test("sort-by=createdAt.asc", async (t) => {
   const params = queryStringParser({ "sort-by": "createdAt.asc" });

   const expected = {
      sortBy: {
         isDescending: false,
         property: "createdAt",
      },
   };

   t.same(params, expected);
});

test("sort-by=createdAt.desc", async (t) => {
   const params = queryStringParser({ "sort-by": "createdAt.desc" });

   const expected = {
      sortBy: {
         isDescending: true,
         property: "createdAt",
      },
   };

   t.same(params, expected);
});

test("sort-by=updatedAt.asc", async (t) => {
   const params = queryStringParser({ "sort-by": "updatedAt.asc" });

   const expected = {
      sortBy: {
         isDescending: false,
         property: "updatedAt",
      },
   };

   t.same(params, expected);
});

test("sort-by=updatedAt.desc", async (t) => {
   const params = queryStringParser({ "sort-by": "updatedAt.desc" });

   const expected = {
      sortBy: {
         isDescending: true,
         property: "updatedAt",
      },
   };

   t.same(params, expected);
});
// #endregion ------------------------------------------------------------------

// #region ---------------------------------------------------- completed or not
test("is-completed=true", async (t) => {
   const params = queryStringParser({ "is-completed": "true" });

   const expected = {
      isCompleted: true,
   };

   t.same(params, expected);
});

test("is-completed=1", async (t) => {
   const params = queryStringParser({ "is-completed": "1" });

   const expected = {
      isCompleted: true,
   };

   t.same(params, expected);
});

test("is-completed=false", async (t) => {
   const params = queryStringParser({ "is-completed": "false" });

   const expected = {
      isCompleted: false,
   };

   t.same(params, expected);
});

test("is-completed=0", async (t) => {
   const params = queryStringParser({ "is-completed": "0" });

   const expected = {
      isCompleted: false,
   };

   t.same(params, expected);
});
// #endregion ------------------------------------------------------------------

// #region ------------------------------------------------------ invalid params
test("sort-by=invalid.asc", async (t) => {
   const params = queryStringParser({ "sort-by": "invalid.asc" });

   t.same(params, null, "return null");
});

test("sort-by=createdAt.invalid", async (t) => {
   const params = queryStringParser({ "sort-by": "createdAt.invalid" });

   t.same(params, null, "return null");
});

test("invalid=1", async (t) => {
   const params = queryStringParser({ invalid: 1 });

   t.same(params, null, "return null");
});
// #endregion ------------------------------------------------------------------
