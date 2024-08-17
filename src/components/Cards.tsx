import axios from 'axios';
import '../Styles/Cards.css';
import { Item } from '../Interfaces'; // Import Item type

interface CardsProps {
  item:Item;
  handleClick: (item: Item) => void;
}

const Cards: React.FC<CardsProps> = ({ item, handleClick }) => {
  const { item_id, title, price, img } = item;

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart', {
        item_id,
        title,
        price,
        img,
        amount: 1, // Default amount to 1 when adding to cart
      });
      handleClick(item); 
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
    
  return (
    <div className="cards">
      <div className="image_box">
        <img src={img} alt="Image" />
      </div>
      <div className="details">
        <p>{title}</p>
        <p>Price - {price}Rs</p>
        <button className='add_button' onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default Cards;
