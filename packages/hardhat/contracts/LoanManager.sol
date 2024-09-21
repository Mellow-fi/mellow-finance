// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CollateralManager.sol";

contract LoanManager is ReentrancyGuard {

    IERC20 public cUSDToken; // Token used to finance the loan
    CollateralManager public collateralManager; // Contract that keeps track of user collateral

    uint256 public collateralToLoanRatio = 150; // 150% collateral requirement (i.e. 1.5x collateral for loan)
    uint256 public loanDuration = 30 days;
    uint256 public defaultDuration = 10 days;   // Extra time before liquidation after loan is due

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 startTime;
        uint256 collateral;
        bool isRepaid;
        bool isDefaulted;
    }

    mapping(address => Loan) public userLoans;

    event LoanIssued(address indexed user, uint256 amount, uint256 collateral);
    event LoanRepaid(address indexed user, uint256 amount, uint256 collateralReturned);
    event LoanDefaulted(address indexed user, uint256 collateralLiquidated);

    constructor(IERC20 _cUSDToken, address _collateralManager) {
        cUSDToken = _cUSDToken;
        collateralManager = CollateralManager(_collateralManager);
    }

    // Request a loan based on the user's collateral
    function requestLoan(uint256 _loanAmount) external nonReentrant {
        require(_loanAmount > 0, "LoanManager: Loan amount must be greater than 0");
        require(userLoans[msg.sender].amount == 0, "LoanManager: Existing loan must be repaid first");

        // Ensure user has enough collateral
        (uint256 celoCollateral, uint256 usdtCollateral) = collateralManager.getCollateralBalance(msg.sender);
        uint256 totalCollateral = celoCollateral + usdtCollateral;
        require(totalCollateral > 0, "LoanManager: No collateral available");

        // Calculate maximum loan based on collateral-to-loan ratio
        uint256 maxLoanAmount = totalCollateral * 100 / collateralToLoanRatio;
        require(_loanAmount <= maxLoanAmount, "LoanManager: Insufficient collateral for requested loan amount");

        // Store loan information
        Loan memory newLoan = Loan({
            amount: _loanAmount,
            interestRate: 5, // 5% simple interest rate for this example
            startTime: block.timestamp,
            collateral: totalCollateral,
            isRepaid: false,
            isDefaulted: false
        });
        userLoans[msg.sender] = newLoan;

        // Transfer cUSD to user
        require(cUSDToken.transfer(msg.sender, _loanAmount), "LoanManager: Loan transfer failed");

        emit LoanIssued(msg.sender, _loanAmount, totalCollateral);
    }

    // Repay the loan and recover collateral
    function repayLoan(uint256 _repayAmount) external nonReentrant {
        Loan storage loan = userLoans[msg.sender];
        require(loan.amount > 0, "LoanManager: No active loan");
        require(!loan.isRepaid, "LoanManager: Loan is already repaid");

        // Ensure repayment covers the loan and interest
        uint256 loanWithInterest = loan.amount + (loan.amount * loan.interestRate / 100);
        require(_repayAmount >= loanWithInterest, "LoanManager: Insufficient repayment amount");

        // Transfer repayment amount to the contract
        require(cUSDToken.transferFrom(msg.sender, address(this), _repayAmount), "LoanManager: Repayment transfer failed");

        // Update loan status
        loan.isRepaid = true;

        // Return collateral to the user
        collateralManager.withdrawCeloCollateral(loan.collateral);
        emit LoanRepaid(msg.sender, loan.amount, loan.collateral);
    }

    // Check if a loan has defaulted and liquidate collateral
    function checkDefault(address _user) external nonReentrant {
        Loan storage loan = userLoans[_user];
        require(loan.amount > 0, "LoanManager: No active loan");
        require(!loan.isDefaulted, "LoanManager: Loan already defaulted");
        require(block.timestamp > loan.startTime + loanDuration + defaultDuration, "LoanManager: Loan not defaulted yet");

        // Mark loan as defaulted
        loan.isDefaulted = true;

        // Liquidate collateral
        collateralManager.withdrawCeloCollateral(loan.collateral); // Liquidate collateral (in this example, withdraw to contract)

        emit LoanDefaulted(_user, loan.collateral);
    }

    // Admin functions to update collateralToLoanRatio or loanDuration if needed
    function updateCollateralToLoanRatio(uint256 _newRatio) external {
        require(_newRatio >= 100, "LoanManager: Invalid ratio");
        collateralToLoanRatio = _newRatio;
    }

    function updateLoanDuration(uint256 _newDuration) external {
        require(_newDuration > 0, "LoanManager: Invalid duration");
        loanDuration = _newDuration;
    }

    function updateDefaultDuration(uint256 _newDuration) external {
        require(_newDuration > 0, "LoanManager: Invalid duration");
        defaultDuration = _newDuration;
    }
}
