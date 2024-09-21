// CardComponent.tsx
import React from 'react';

type CardProps = {
  title: string;
  interestRate: number;
  imageUrl: string;
};

const CardComponent: React.FC<CardProps> = ({ title, interestRate, imageUrl }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white mb-6">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">Interest rate: {interestRate}%</p>
        <button className="mt-4 bg-white text-black-500 border border-gray-500 hover:bg-gray-200 hover:text-white py-2 px-4 rounded">
          Borrow
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
