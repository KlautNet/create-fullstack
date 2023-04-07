import { useQuery, gql } from "@apollo/client";

const QUERY = gql`
  query Query {
    ping
  }
`;

export default function Example() {
  const { data, loading, error } = useQuery(QUERY);

  if (loading) {
    return <h2>Loading</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const res = data.ping;

  return <p>{res}</p>;
}
