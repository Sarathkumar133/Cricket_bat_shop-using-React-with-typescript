import React from 'react';
import Cards from './Cards';
import { Item } from '../Interfaces'; // Import Item type

interface AmazonProps {
  handleClick: (item: Item) => void;
  dataList: Item[];
}

const Amazon: React.FC<AmazonProps> = ({ handleClick, dataList }) => {
  return (
    <section>
      {
        dataList.map(item => (
          <Cards item={item} key={item.id} handleClick={handleClick} />
        ))
      }
    </section>
  );
};

export default Amazon;