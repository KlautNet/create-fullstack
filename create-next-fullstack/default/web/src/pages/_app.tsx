import type { AppProps } from "next/app";
import "@/styles/styles.css";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/apollo-client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
