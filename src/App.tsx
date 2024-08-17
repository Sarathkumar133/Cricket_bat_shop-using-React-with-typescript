import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Amazon from './components/Amazon';
import Cart from './components/Cart';
import axios from 'axios';
import './App.css';
import {Item} from "./Interfaces";
// Define types for items in the cart and fetched from API


const App: React.FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const [cart, setCart] = useState<Item[]>([]);
  const [warning, setWarning] = useState<boolean>(false);
  const [dataList, setDataList] = useState<Item[]>([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<Item[]>('http://localhost:5000/api/items');
        setDataList(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        // You might want to set some error state here for user feedback
      }
    };

    fetchItems();
  }, []);

  const handleClick = (item: Item) => {
    const isPresent = cart.some(product => item.id === product.id);
    if (isPresent) {
      setWarning(true);
      setTimeout(() => setWarning(false), 2000);
      return;
    }
    setCart(prevCart => [...prevCart, { ...item, amount: 1 }]); // Initialize amount to 1 when adding to cart
  };

  // Adjust the quantity of an item in the cart
  const handleChange = (item: Item, d:number) => {
    setCart(prevCart => {
      return prevCart.map(cartItem => 
        cartItem.id === item.id
          ? { ...cartItem, amount: Math.max((cartItem.amount || 1) + d, 1) }
          : cartItem
      );
    });
  };

  return (
    <>
      <Navbar size={cart.length} setShow={setShow} />
      {show ? (
        <Amazon handleClick={handleClick} dataList={dataList} />
      ) : (
        <Cart cart={cart} setCart={setCart} handleChange={handleChange} />
      )}
      {warning && <div className='warning'>Item is already added to your cart</div>}
    </>
  );
};

export default App;
