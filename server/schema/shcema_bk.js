const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

//dummy data
var books = [
  { name: "Name of the wind", genre: "Fantasy", id: "1", authorId: "3" },
  { name: "The final empire", genre: "Fantasy", id: "2", authorId: "1" },
  { name: "The long Earth", genre: "Sci-Fi", id: "3", authorId: "2" },
  { name: "The Think", genre: "Cycology", id: "4", authorId: "3" },
  { name: "Harry Potter", genre: "Fiction", id: "5", authorId: "2" },
  { name: "Consistancy", genre: "genral", id: "6", authorId: "2" }
];

var authors = [
  { name: "Patrick Rothfuss", age: 44, id: "1" },
  { name: "albert fernindo", age: 32, id: "2" },
  { name: "Terry pratchett", age: 66, id: "3" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AutherType,
      resolve(parent, args) {
        //console.log(parent);
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AutherType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuerytype",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from  db / other source
        return _.find(books, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    author: {
      type: AutherType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    authors: {
      type: new GraphQLList(AutherType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
