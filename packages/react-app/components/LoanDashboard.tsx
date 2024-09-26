import React, { useState, useEffect } from 'react';

interface LoanData {
  loanAmount: number;
  collateralAmount: number;
  loanToValueRatio: number;
  isSufficientlyCollateralized: boolean;
}

const LoanDashboard: React.FC = () => {
  const [loanData, setLoanData] = useState<LoanData | null>(null);

  // Fetch loan data (replace with actual API call)
  useEffect(() => {
    
    // Mock data for now
    const fetchLoanData = async () => {
      const mockLoanData: LoanData = {
        loanAmount: 5000,
        collateralAmount: 10000,
        loanToValueRatio: 0.5,  // 50% Loan-to-Value (LTV) ratio
        isSufficientlyCollateralized: true,
      };
      setLoanData(mockLoanData);
    };

    fetchLoanData();
  }, []);

  if (!loanData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Loan Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-medium mb-2">Your Loan</h3>
        <p><strong>Loan Amount:</strong> ${loanData.loanAmount.toLocaleString()}</p>
        <p><strong>Collateral Amount:</strong> ${loanData.collateralAmount.toLocaleString()}</p>
        <p><strong>Loan-to-Value (LTV) Ratio:</strong> {loanData.loanToValueRatio * 100}%</p>
        <p><strong>Collateralization Status:</strong> 
          {loanData.isSufficientlyCollateralized ? (
            <span className="text-green-500 font-semibold"> Sufficient</span>
          ) : (
            <span className="text-red-500 font-semibold"> Insufficient</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoanDashboard;
