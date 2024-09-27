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
  const { getMaxLoanAmount, getCollateralBalanceinUSD, requestLoan, releaseFunds } = useWeb3(); 

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
  }

  return (
    <div>
    <Navbar />
    <div className="p-6 bg-gray-100 min-h-screen">
      

      <h2 className="text-2xl font-semibold mb-4">Loan Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-medium mb-2">Your Loan</h3>
        <p><strong>Loan Amount:</strong> ${loanData?.loanAmount?.toLocaleString()}</p>
        <p><strong>Collateral Amount:</strong> ${loanData?.collateralAmount.toLocaleString()}</p>
        <p><strong>Loan-to-Value (LTV) Ratio:</strong> {loanData?.loanToValueRatio ? loanData.loanToValueRatio * 100 : 0}%</p>
        <p><strong>Collateralization Status:</strong> 
          {loanData?.isSufficientlyCollateralized ? (
            <span className="text-green-500 font-semibold"> Sufficient</span>
          ) : (
            <span className="text-red-500 font-semibold"> Insufficient</span>
          )}
        </p>
        {/*loan amount input*/}
        <label htmlFor="borrowAmount" 
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >Enter Loan Amount:</label>
        <input type="number" id="borrowAmount" value={borrowAmount ?? ""} 
        onChange={(e) => setBorrowAmount(e.target.value)}
        placeholder='Enter Loan Amount you want to borrow'

        />
        <button onClick={handleBorrowLoan} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 mt-4 px-4 rounded">submit borrow Loan</button>
        {/*borrow loan button*/}
        <button onClick={handleBorrowLoan} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded">Borrow Loan</button>

        <button onClick={handleBorrowLoan} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded">withdraw collateral</button>

      </div>
      <div className='bg-gray-100 '>
        <Footer />
      </div>
    </div>
  );
};

export default LoanDashboard;
