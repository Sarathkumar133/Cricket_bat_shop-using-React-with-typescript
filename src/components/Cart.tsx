import React, { useState, useEffect } from 'react';
import "../Styles/Cart.css";
import { Item } from '../Interfaces'; // Import Item type

interface CartProps {
  cart: Item[];
  setCart: React.Dispatch<React.SetStateAction<Item[]>>;
  handleChange: (item: Item, change: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, setCart, handleChange }) => {
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const handlePrice = () => {
    // Calculate total amount of items in the cart
    const totalAmount = cart.reduce((acc, item) => acc + (item.amount || 1) * item.price, 0);
    
    // Calculate total discount based on rules
    const totalDiscount = evaluateRules(cart);
    
    // Set discount and final price (total amount - discount)
    setDiscount(totalDiscount);
    setPrice(totalAmount - totalDiscount);
  };

  const handleRemove = async (item_id: number) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${item_id}`, {
        method: 'DELETE',
      });

      const updatedCart = cart.filter(item => item.id !== item_id);
      setCart(updatedCart);

      handlePrice();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  useEffect(() => {
    handlePrice(); // Recalculate price when cart changes
  }, [cart]);

  const handleQuantityChange = async (item: Item, change: number) => {
    const newAmount = (item.amount || 1) + change;
    
    if (newAmount < 1) return; // Prevent negative quantities

    try {
      await fetch(`http://localhost:5000/api/cart/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      const updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, amount: newAmount }
          : cartItem
      );
      setCart(updatedCart);

      handlePrice();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const evaluateRules = (cart: Item[]) => {
    let discount = 0;
    const totalAmount = cart.reduce((acc, item) => acc + (item.amount || 1) * item.price, 0);
    const totalQuantity = cart.reduce((acc, item) => acc + (item.amount || 1), 0);
  
    const rules = [
      // {
      //   condition: totalAmount > 10000,
      //   discount: 1000, // 
      // },
      {
        condition: totalQuantity >= 3,
        discount: 3000, 
      }
    ];
  
    rules.forEach(rule => {
      if (rule.condition) {
        discount += rule.discount;
      }
    });

    return discount;
  };

  return (
    <article>
      {cart?.map(item => (
        <div className="cart_box" key={item.id}>
          <div className="cart_img">
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
          </div>
          <div>
            <button className='button2' onClick={() => handleChange(item, -1)}> -</button>
            <button className='button3'>{item.amount || 1}</button>
            <button className='button2' onClick={() => handleChange(item, +1)}> + </button>
          </div>
          <div>
            <span className='price1'>{item.price}</span>
            <button className='button4' onClick={() => handleRemove(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <div className='total'>
        <span>Total Price of your Cart</span>
        <span> {price}₹</span> 
      </div>
      <div className='discount'>
        <span>Discount Applied</span>
        <span> {discount}₹</span>
      </div>
      <div className='final_amount'>
        <span>Final Amount</span>
        <span > {price-discount}₹</span> 
      </div>
    </article>
  );
};

export default Cart;
