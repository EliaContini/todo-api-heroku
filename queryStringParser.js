/**
 * @module queryStringParser
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Parse and validate URI query string
 *
 */

const isValidSortProperty = (property) => {
   const SORTABLE_PROPERTIES = ["createdAt", "updatedAt"];

   return SORTABLE_PROPERTIES.indexOf(property) === -1 ? false : true;
};

const isValidOrderBy = (orderBy) => {
   const ORDER_BY = ["asc", "desc"];

   return ORDER_BY.indexOf(orderBy) === -1 ? false : true;
};

const isValidState = (state) => {
   const STATE = ["done", "todo"];

   return STATE.indexOf(state) === -1 ? false : true;
};

const queryStringParser = (query) => {
   if (Object.keys(query).length === 0) {
      return null;
   }

   let params = {};
   for (const key in query) {
      switch (key) {
         case "sort-by": {
            const tokens = query[key].split(".");

            if (isValidSortProperty(tokens[0]) && isValidOrderBy(tokens[1])) {
               params.sortBy = {
                  isDescending: tokens[1] === "desc" ? true : false,
                  property: tokens[0],
               };
            }

            break;
         }
         case "state": {
            const state = query[key];

            if (isValidState(state)) {
               params.isCompleted = state === "done" ? true : false;
            }

            break;
         }
      }
   }

   if (Object.keys(params).length === 0) {
      return null;
   }

   return params;
};

module.exports = queryStringParser;
