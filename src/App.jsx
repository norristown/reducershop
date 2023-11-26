import { useEffect, useState, useReducer } from "react";

function App() {
  const initialState = {
    data: [],
    //loading, error, ready, active, finished
    cart: { items: [], total: 0 },
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemQuan, setItemQuan] = useState(() =>
    Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      quantity: 1,
    }))
  );
  const [{ data }, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_ITEM":
        return {
          ...state,
          cart: {
            ...state.cart,
            items: [...state.cart.items, action.payload],
            total: state.cart.items.reduce((acc, curr) => acc + curr.price, 0),
          },
        };
      case "INC_ITEM":
        return console.log("inc");
      case "dataReceived":
        return { ...state, data: action.payload };
      case "dataFailed":
        return { ...state, status: "Error" };
      default:
        throw new Error("action unknown");
    }
  }

  useEffect(function () {
    async function fetchAPI() {
      try {
        setIsLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");

        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "dataFailed" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAPI();
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <StorePage
          data={data}
          dispatch={dispatch}
          itemQuan={itemQuan}
          onSetItemQuan={setItemQuan}
        />
      )}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

function StorePage({ data, dispatch, itemQuan, onSetItemQuan }) {
  const displayQuan = (x) =>
    itemQuan.find((item) => item.id === x.id && item).quantity;
  function handleChange(id, e) {
    onSetItemQuan((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(e.target.value) } : item
      )
    );
  }
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((x) => (
        <div
          className="flex flex-col items-center justify-between border rounded-lg"
          key={x.id}
        >
          <p>Title: {x.title}</p>

          <img src={x.image} width={200} />

          <div className="grid grid-cols-3 items-center justify-center px-4 mt-4">
            <div className="">
              <button className="focus:outline-none text-white bg-stone-600 hover:bg-stone-700  font-medium rounded text-sm px-2 mr-2 mb-2 ">
                -
              </button>
              <input
                className="text-stone-900 w-1/12 text-center mr-2"
                value={displayQuan(x)}
                onChange={(e) => handleChange(x.id, e)}
              ></input>
              <button
                className="focus:outline-none text-white bg-green-600 hover:bg-green-700  font-medium rounded text-sm px-2 mr-2 mb-2 "
                id={x.id}
              >
                +
              </button>
            </div>
            <p>Price: {x.price}</p>
            <button
              id={x.id}
              className="w-full focus:outline-none text-white bg-green-600 hover:bg-green-700  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 w-1/3"
              onClick={() =>
                dispatch({
                  type: "ADD_ITEM",
                  payload: {
                    id: x.id,
                    title: x.title,
                    price: x.price,
                    quantity: 1,
                  },
                })
              }
            >
              Add To Cart
            </button>
          </div>
        </div>
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
