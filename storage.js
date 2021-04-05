/**
 * @module storage
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Connect and query MongoDB
 *
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
   {
      isCompleted: {
         default: false,
         type: Boolean,
      },
      text: {
         required: true,
         type: String,
      },
   },
   { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

const storage = (mongoUri) => {
   // https://mongoosejs.com/docs/connections.html#buffering
   const connectionHandler = mongoose.connect(mongoUri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
   });

   return {
      close: () => {
         mongoose.connection.close();
      },
      /**
       * Create a todo
       *
       * @param {object} params - parameters to create a todo
       * @param {string} params.text - the todo text
       *
       * @returns {mongoose.Query} the todo
       */
      create: async (params) => {
         const todo = new Todo({
            text: params.text,
         });

         return todo.save();
      },
      /**
       * Get todos according to params
       *
       * @param {object}  params
       *
       * @param {object}  params.sortBy - sort constraints
       * @param {string}  params.sortBy.property - property to sort
       * @param {boolean} params.sortBy.isDescending - false for ascending,
       *      true for descending
       *
       * @param {string}  params.isCompleted - only todos completed or not
       *
       * @returns {mongoose.Query} the todos that match params
       */
      get: async (params) => {
         let queryParams = {};
         let sortParams = {};

         if (params != null) {
            // get by id
            if ("id" in params && params.id != null) {
               return Todo.findById(params.id).then(
                  (response) => {
                     return response;
                  },
                  (error) => {
                     return null;
                  }
               );
            }
            // all others get
            for (var key in params) {
               switch (key) {
                  case "isCompleted": {
                     queryParams.isCompleted = params[key];

                     break;
                  }
                  case "sortBy": {
                     const paramsSortBy = params[key];

                     sortParams[
                        paramsSortBy.property
                     ] = paramsSortBy.isDescending ? -1 : 1;

                     break;
                  }
               }
            }
         }

         return Todo.find(queryParams).sort(sortParams);
      },
      /**
       * Remove a todo
       *
       * @param {string} id - id of the todo
       *
       * @returns {mongoose.Query} the removed todo
       */
      remove: async (id) => {
         return Todo.findOneAndDelete({ _id: id });
      },
      /**
       * Update a todo
       *
       * @param {object} todo
       *
       * @returns {mongoose.Query} the updated todo
       */
      update: async (todo) => {
         return Todo.findOneAndUpdate({ _id: todo._id }, todo, { new: true });
      },
   };
};

module.exports = storage;
