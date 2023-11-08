import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [storeItems, setStoreItems] = useState([]);
  useEffect(function () {
    async function fetchAPI() {
      try {
        setIsLoading(true);
        const res = await fetch("https://dummyjson.com/products");

        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        console.log(data.products);
        setStoreItems(data.products);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAPI();
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && !error && <StorePage storeItems={storeItems} />}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

function StorePage({ storeItems }) {
  return (
    <>
      {storeItems.map((prev) => (
        <div key={prev.id}>
          <p>{prev.id}</p>
          <p>{prev.brand}</p>
          <img src={prev.images[0]} />
        </div>
      ))}
    </>
  );
}

function Loader() {
  return <div>Loading...</div>;
}

function ErrorMessage({ message }) {
  return <p>{message}</p>;
}

export default App;
