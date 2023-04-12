import "reflect-metadata"
import { AppDataSource } from "./data-source"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { PingResolver } from "./resolvers/ping"
import cors from 'cors'

const main = async() => {
    AppDataSource.initialize()
    .then(() => {
        console.log("Connected to database")
    }).catch((_) => {
        console.log(`Error while connecting to database. Please change the Credentials!`)
    })

    const app = express();

    app.use(
        cors({
          origin: "http://localhost:3000",
          credentials: true,
        })
      );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PingResolver],
            validate: false
        }),
        context: ({req, res}) => ({
            req,
            res
        })
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({
        app,
        cors: false
    })

    app.listen(4000, () => {
        console.log("server started on localhost:4000");
      });
}

main().catch((err) => {
    console.error(err);
});
