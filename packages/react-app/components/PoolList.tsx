// PoolList.tsx
import React from 'react';
import CardComponent from './cardComponent';

const PoolList: React.FC = () => {
  const pools = [
    {
      title: 'Celo/cKES Pool',
      interestRate: 8,
      imageUrl: '../static/cardImage.png', 
    },
    {
      title: 'USDT/cKES Pool',
      interestRate: 8,
      imageUrl: '../static/secondCardImage.png', 
    },
  ];

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Mellow</h1>
      {pools.map((pool, index) => (
        <CardComponent
          key={index}
          title={pool.title}
          interestRate={pool.interestRate}
          imageUrl={pool.imageUrl}  
        />
      ))}
    </div>
  );
};

export default PoolList;
