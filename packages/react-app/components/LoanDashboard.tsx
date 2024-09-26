import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/useWeb3';  // Make sure this is the correct path to the useWeb3 hook

interface LoanData {
  loanAmount: number;
  collateralAmount: number;
  loanToValueRatio: number;
  isSufficientlyCollateralized: boolean;
}

const LoanDashboard: React.FC = () => {
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const { getMaxLoanAmount, getCollateralBalanceinUSD } = useWeb3(); // Access getMaxLoanAmount from useWeb3

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        // Call the getMaxLoanAmount function from the contract
        const maxLoanAmount = await getMaxLoanAmount();
        // Get the user collateral
        const uCollat = await getCollateralBalanceinUSD();
        // Get the LTV for loans
        // Sufficiently collateralized
        
        // Update loan data based on the fetched max loan amount
        const updatedLoanData: LoanData = {
          loanAmount: parseFloat(maxLoanAmount), // Convert to a number if necessary
          collateralAmount: parseFloat(uCollat), // Placeholder collateral amount
          loanToValueRatio: 15,  // Placeholder LTV ratio
          isSufficientlyCollateralized: true, // Placeholder collateralization status
        };

        setLoanData(updatedLoanData);
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    fetchLoanData();
  }, [getMaxLoanAmount, getCollateralBalanceinUSD]); // Re-run when getMaxLoanAmount changes

  const handleBorrowLoan =()=>{
    alert("Borrowing loan...");
  }
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
        {/*borrow loan button*/}
        <button onClick={handleBorrowLoan} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded">Borrow Loan</button>
      </div>
    </div>
  );
};

export default LoanDashboard;