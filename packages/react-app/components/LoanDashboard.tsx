import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/useWeb3';  // Make sure this is the correct path to the useWeb3 hook
import Navbar from './NavBar';
import Footer from './Footer';

interface LoanData {
  loanAmount: number;
  collateralAmount: number;
  loanToValueRatio: number;
  isSufficientlyCollateralized: boolean;
}

const LoanDashboard: React.FC = () => {
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const { getMaxLoanAmount, getCollateralBalanceinUSD, requestLoan } = useWeb3(); 

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const maxLoanAmount = await getMaxLoanAmount();
        const uCollat = await getCollateralBalanceinUSD();
        const updatedLoanData: LoanData = {
          loanAmount: parseFloat(maxLoanAmount), 
          collateralAmount: parseFloat(uCollat), 
          loanToValueRatio: 1.5,  
          isSufficientlyCollateralized: true,
        };
        setLoanData(updatedLoanData);
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };
    fetchLoanData();
  }, [getMaxLoanAmount, getCollateralBalanceinUSD]);

  const [borrowAmount, setBorrowAmount] = useState<string>("");

  const handleBorrowLoan = async () => {
    try {
      if (loanData) {
        await requestLoan(loanData.loanAmount.toString());
        alert("Loan request successful!");
      } else {
        console.error("Loan data is null.");
      }
    } catch (error) {
      console.error("Error borrowing loan:", error);
      alert("Error borrowing loan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Dashboard</h2>

        {/* Grid layout to place cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1: Your Loan & Borrow Loan Button */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Loan</h3>
            <div className="space-y-3 text-gray-700 text-sm">
              <p><strong>Loan Amount:</strong> ${loanData?.loanAmount?.toLocaleString()}</p>
              <p><strong>Collateral Amount:</strong> ${loanData?.collateralAmount.toLocaleString()}</p>
              <p><strong>Loan-to-Value (LTV) Ratio:</strong> {loanData?.loanToValueRatio ? loanData.loanToValueRatio * 100 : 0}%</p>
              <p><strong>Collateralization Status:</strong>
                {loanData?.isSufficientlyCollateralized ? (
                  <span className="text-green-600 font-bold"> Sufficient</span>
                ) : (
                  <span className="text-red-600 font-bold"> Insufficient</span>
                )}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleBorrowLoan}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              >
                Borrow Loan
              </button>
            </div>
          </div>

          {/* Card 2: Enter Loan Amount & Submit Borrow Loan Button */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Enter Loan Amount</h3>
            <div className="mt-4">
              <label htmlFor="borrowAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Loan Amount:
              </label>
              <input
                type="number"
                id="borrowAmount"
                value={borrowAmount ?? ""}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 text-sm"
                placeholder="Enter loan amount you want to borrow"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleBorrowLoan}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              >
                Submit Borrow Loan
              </button>
            </div>
          </div>
        </div>

        {/* Withdraw Collateral Button below the cards */}
        <div className="mt-6">
          <button
            onClick={handleBorrowLoan}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
          >
            Withdraw Collateral
          </button>
        </div>

      </div>
      <div className='bg-gray-100 '>
        <Footer />
      </div>
    </div>
  );
};

export default LoanDashboard;
