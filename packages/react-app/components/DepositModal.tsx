// DepositModal.tsx
import React, { useState } from 'react';

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
};

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState<number>(0);

  const handleDeposit = () => {
    // Here you can add wallet connection logic before depositing
    onDeposit(amount);
    onClose(); // Close the modal after deposit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-4">Deposit ETH</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount of ETH to deposit"
          className="border rounded p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button className="mr-2 text-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleDeposit}>
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
