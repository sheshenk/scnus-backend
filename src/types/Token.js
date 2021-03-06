import { CONTEXT, createModule, gql } from "graphql-modules";
import { createToken, deleteToken, readToken, readTokens, updateToken } from "../db_functions/Token.js";

const TokenModule = createModule({
	id: 'token',
	typeDefs: gql`
		type Token {
			_id: ID!
			event: String!
			name: String!
			description: String
			imageURL: String!
			link: String
			owners: [ID!]!
			ownerCount: Int
		}

		type Query {
			readTokens: [Token!]!
			readToken(_id: ID!): Token
		}

		type Mutation {
			createToken(event: String!, name: String!, description: String, imageURL: String!, link: String): HTTPResponse
			updateToken(_id: String!, name: String, description: String, imageURL: String, link: String): HTTPResponse
			addTokenToCurrentUser(_id: ID!): HTTPResponse
			deleteToken(_id: ID!): HTTPResponse
		}

	`,
	resolvers: {
		Token: {
			ownerCount: (parent) => readToken(parent).then(n => n.owners.length)
		},
		Query: {
			readTokens: () => readTokens(),
			readToken: (_, args) => readToken(args),
		},
		Mutation: {
			createToken: (_, args) => createToken(args),
			updateToken: (_, args) => updateToken({_id: args._id}, args),
			addTokenToCurrentUser: (_, args, context) => updateToken({_id: args._id}, { $addToSet: { owners: context._id }}),
			deleteToken: (_, args) => deleteToken(args)
		}
	}
})

export default TokenModule