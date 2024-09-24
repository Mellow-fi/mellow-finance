// CardComponent.tsx
import React, { useState } from 'react';
// import DepositModal from './DepositModal';
import DepositCeloModal from './DepositCeloModal';

type CardProps = {
  title: string;
  interestRate: number;
  imageUrl: string;
};

const CardComponent: React.FC<CardProps> = ({ title, interestRate, imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeposit = (amount: number) => {
    // Here you would implement wallet connection logic
    console.log(`Deposited: ${amount}`); // Implement your deposit logic here
    // After successful deposit, you can proceed to grant the loan
  };

  const handleBorrowClick = () => {
    setIsModalOpen(true); // Open the deposit modal first
  };

  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white mb-6">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">Interest rate: {interestRate}%</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleBorrowClick} // Open modal
        >
          Borrow
        </button>
      </div>
      <DepositCeloModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onDeposit={handleDeposit}
      />
    </div>
  );
};

export default CardComponent;
