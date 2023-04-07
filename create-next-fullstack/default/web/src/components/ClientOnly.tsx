import { useEffect, useState } from "react";

interface Props {
  children: JSX.Element;
}

/*
 * Wrapper for Clientside rendering
 */
export default function ClientOnly({ children, ...delegated }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}
