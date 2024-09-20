// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract CollateralManager is ReentrancyGuard, Pausable, Ownable {

    IERC20 public usdtToken;

    // Mapping for user's collateral balance in Celo and USDT
    mapping(address => uint256) public userCollateralCelo;
    mapping(address => uint256) public userCollateralUsdt;

    event CeloCollateralDeposited(address indexed user, uint256 amount);
    event CeloCollateralWithdrawn(address indexed user, uint256 amount);
    event UsdtCollateralDeposited(address indexed user, uint256 amount);
    event UsdtCollateralWithdrawn(address indexed user, uint256 amount);

    constructor(IERC20 _collateralToken) Ownable(msg.sender){
        usdtToken = _collateralToken;
    }

    function depositCeloCollateral() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "CollateralManager: Invalid amount");
        userCollateralCelo[msg.sender] += msg.value;
        emit CeloCollateralDeposited(msg.sender, msg.value);
    }

    function withdrawCeloCollateral(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "CollateralManager: Invalid amount");
        require(userCollateralCelo[msg.sender] >= _amount, "CollateralManager: Insufficient balance");
        userCollateralCelo[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit CeloCollateralWithdrawn(msg.sender, _amount);

        
    }

    function depositUsdtCollateral(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "CollateralManager: Invalid amount");
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "CollateralManager: Transfer failed");
        userCollateralUsdt[msg.sender] += _amount;
        emit UsdtCollateralDeposited(msg.sender, _amount);
    }

    function withdrawUsdtCollateral(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount > 0, "CollateralManager: Invalid amount");
        require(userCollateralUsdt[msg.sender] >= _amount, "CollateralManager: Insufficient balance");
        userCollateralUsdt[msg.sender] -= _amount;
        require(usdtToken.transfer(msg.sender, _amount), "CollateralManager: Transfer failed");
        emit UsdtCollateralWithdrawn(msg.sender, _amount);
    }

    function getCollateralBalance(address _user) external view returns (uint256 celo, uint256 usdt) {
        return (userCollateralCelo[_user], userCollateralUsdt[_user]);
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}