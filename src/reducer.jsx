import { useReducer } from "react";

const initialState = {
  items: [],
  total: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.items.find((item) => item.id === action.payload.id)) {
        // If the item already exists in the cart, update the quantity
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price * action.payload.quantity,
        };
      } else {
        // If the item is not in the cart, add it
        return {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + action.payload.price * action.payload.quantity,
        };
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        total: state.total - action.payload.price * action.payload.quantity,
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

function ShoppingCart() {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  const addItemToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItemFromCart = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {cartState.items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} - Quantity: {item.quantity}
            <button onClick={() => removeItemFromCart(item)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cartState.total}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

export default ShoppingCart;
