import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import fs from "fs";
import { resolvers } from "./resolvers";
import dotenv from "dotenv";
dotenv.config();

import "./utils/db";

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001", "*"],
    },
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const typeDefs = fs.readFileSync("src/schema.graphql", { encoding: "utf-8" });
startApolloServer(typeDefs, resolvers);
