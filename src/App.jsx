import { useEffect, useState, useReducer } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const initialState = {
    data: [],
    //loading, error, ready, active, finished
    status: "loading",
  };
  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, data: action.payload };
      case "dataFailed":
        return { ...state, status: "Error" };
      default:
        throw new Error("action unknown");
    }
  }
  const [{ data, status }, dispatch] = useReducer(reducer, initialState);
  useEffect(function () {
    // const controller = new AbortController();
    // async function fetchAPI() {
    //   try {
    //     setIsLoading(true);
    //     const res = await fetch("https://fakestoreapi.com/products",
    //     // {signal: controller.signal,}
    //     );

    //     if (!res.ok) throw new Error("Something went wrong");
    //     const data = await res.json();
    //     dispatch({ type: "dataReceived", payload: data });
    //   } catch (err) {
    //     console.log(err);
    //     setError(err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
    // fetchAPI();

    // return function () {
    //   controller.abort();
    // };
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && !error && <StorePage data={data} />}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

function StorePage({ data }) {
  return (
    <div>
      {data.map((x) => (
        <div key={x.id}>{x.title}</div>
      ))}
    </div>
  );
}

function Loader() {
  return <div>Loading...</div>;
}

function ErrorMessage({ message }) {
  return <p>{message}</p>;
}

export default App;
