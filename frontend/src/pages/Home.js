import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Kate's Website - Home Page";
  }, []);

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <h1>Home Page</h1>
    </div>
  );
}
