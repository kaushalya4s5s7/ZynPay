// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title UltraSimplePayment
 * @dev Ultra-minimal payment contract for kaia testing
 */
contract UltraSimplePayment {
    
    // Events
    event PaymentSent(address indexed sender, address indexed recipient, uint256 amount);
    event PaymentReceived(address indexed from, uint256 amount);
    
    // State variables
    uint256 public totalPayments;
    uint256 public totalVolume;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Send payment to a recipient (simplest version)
     */
    function sendPayment(address recipient) external payable {
        require(recipient != address(0), "Invalid recipient");
        require(msg.value > 0, "No payment");
        
        // Send the payment
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Update tracking
        totalPayments++;
        totalVolume += msg.value;
        
        emit PaymentSent(msg.sender, recipient, msg.value);
    }
    
    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Get statistics
     */
    function getStats() external view returns (uint256, uint256) {
        return (totalPayments, totalVolume);
    }
    
    /**
     * @notice Receive function
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
