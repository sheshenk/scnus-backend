import { createModule, gql } from "graphql-modules";
import {
	readMerchant,
	readMerchants,
	updateMerchant,
	createMerchant
  } from "../db_functions/Merchant.js";
import { readRedemptions } from "../db_functions/Redemption.js";

const MerchantModule = createModule({
  id: "merchant",
  typeDefs: gql`
    type Merchant implements User {
      _id: ID!
      name: String!
      phone: ID!
      redemptions: [Redemption!]!
    }

    type Query {
      getAllMerchants: [Merchant!]!
      getMerchant(_id: ID, phone: ID): Merchant
    }

    type Mutation {
      createMerchant(name: String!, phone: String!): HTTPResponse
      updateMerchant(queryPhone: String!, name: String!): HTTPResponse
    }
  `,
  resolvers: {
    Merchant: {
      redemptions: (parent) => readRedemptions({merchantId: parent._id})
    },
    Query: {
      getAllMerchants: () => readMerchants(),
      getMerchant: (_, args) => readMerchant(args),
    },
    Mutation: {
      createMerchant: (_, args) => createMerchant(args),
      updateMerchant: (_, args) => updateMerchant({ phone: args.queryPhone }, deleteKey(args, ['queryPhone'])),
    },
  },
});

export default MerchantModule;
