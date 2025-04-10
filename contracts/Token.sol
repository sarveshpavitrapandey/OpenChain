
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ScienceToken
 * @dev ERC20 Token for the decentralized scientific publishing platform
 */
contract ScienceToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint8 private _tokenDecimals;
    uint256 public maxSupply;
    
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    
    /**
     * @dev Constructor for ScienceToken
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals The number of decimals for the token
     * @param _maxSupply The maximum supply of tokens that can ever be minted
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 _maxSupply
    ) ERC20(name, symbol) {
        _tokenDecimals = decimals;
        maxSupply = _maxSupply;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _tokenDecimals;
    }
    
    /**
     * @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Requirements:
     * - `account` cannot be the zero address.
     * - Caller must have the MINTER_ROLE.
     * - Total supply after minting cannot exceed maxSupply.
     */
    function mint(address account, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= maxSupply, "Exceeds maximum token supply");
        _mint(account, amount);
    }
    
    /**
     * @dev Distributes rewards to a recipient and emits an event with a reason
     * @param recipient The address of the reward recipient
     * @param amount The amount of tokens to reward
     * @param reason The reason for the reward
     */
    function distributeReward(address recipient, uint256 amount, string memory reason) 
        public 
        onlyRole(MINTER_ROLE) 
        returns (bool) 
    {
        require(recipient != address(0), "Cannot reward zero address");
        require(amount > 0, "Reward amount must be positive");
        
        mint(recipient, amount);
        
        emit RewardDistributed(recipient, amount, reason);
        
        return true;
    }
    
    /**
     * @dev Update the maximum token supply
     * @param _newMaxSupply New maximum supply
     * Requirements:
     * - Must be greater than or equal to current total supply
     */
    function updateMaxSupply(uint256 _newMaxSupply) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newMaxSupply >= totalSupply(), "New max supply cannot be less than current total supply");
        maxSupply = _newMaxSupply;
    }
}
