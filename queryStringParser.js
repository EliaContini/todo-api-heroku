/**
 * @module queryStringParser
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Parse and validate URL query string
 *
 */

"use strict";

const getBooleanFromString = (valueString) => {
   switch (valueString) {
      case "1":
      case "true": {
         return true;
      }
      default: {
         return false;
      }
   }
};

const isValidSortProperty = (property) => {
   const SORTABLE_PROPERTIES = ["createdAt", "updatedAt"];

   return SORTABLE_PROPERTIES.indexOf(property) === -1 ? false : true;
};

const isValidOrderBy = (orderBy) => {
   const ORDER_BY = ["asc", "desc"];

   return ORDER_BY.indexOf(orderBy) === -1 ? false : true;
};

const queryStringParser = (query) => {
   if (query == null || Object.keys(query).length === 0) {
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
         case "is-completed": {
            const isCompleted = getBooleanFromString(query[key]);

            params.isCompleted = isCompleted;

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
