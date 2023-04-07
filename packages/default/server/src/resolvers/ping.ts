import { Resolver, Query } from "type-graphql";

@Resolver()
export class PingResolver {
  @Query(() => String)
  ping() {
    return "pong";
  }
}