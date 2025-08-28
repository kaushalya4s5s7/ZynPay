// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureTransfer is ReentrancyGuard {
    // Status constants
    uint8 private constant STATUS_SENT = 0;
    uint8 private constant STATUS_CLAIMED = 1;
    uint8 private constant STATUS_REIMBURSED = 2;
    
    // Payment data structure
    struct Payment {
        address payer;
        address payee;
        uint256 amount;
        uint256 createdAt;
        bytes32 paymentId;
        uint8 status;
        address tokenAddress; 
        bool exists;
    }
    
    // Mappings
    mapping(bytes32 => Payment) public payments;
    
    // Events
    event PaymentSent(
        bytes32 indexed paymentId,
        address indexed from,
        address indexed to,
        uint256 amount,
        address tokenAddress
    );
    
    event PaymentClaimed(
        bytes32 indexed paymentId,
        address indexed by,
        uint256 amount,
        address tokenAddress
    );
    
    event PaymentReimbursed(
        bytes32 indexed paymentId,
        address indexed by,
        uint256 amount,
        address tokenAddress
    );
    
    // Errors
    error ZeroAmount();
    error InvalidPayee();
    error NothingToClaim();
    error NotPayee();
    error CannotReimburse();
    error NotPayer();
    error PaymentAlreadyExists();
    error TransferFailed();
    
    // Create an escrow payment with ETH
    function sendETH(bytes32 paymentId, address payee) external payable nonReentrant {
        // Validations
        if (msg.value == 0) revert ZeroAmount();
        if (payee == address(0)) revert InvalidPayee();
        if (payments[paymentId].exists) revert PaymentAlreadyExists();
        
        // Create payment
        payments[paymentId] = Payment({
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            createdAt: block.timestamp,
            paymentId: paymentId,
            status: STATUS_SENT,
            tokenAddress: address(0),
            exists: true
        });
        
        // Emit event
        emit PaymentSent(
            paymentId,
            msg.sender,
            payee,
            msg.value,
            address(0)
        );
    }
    
    // Create an escrow payment with ERC-20 tokens
    function sendERC20(
        bytes32 paymentId,
        address payee,
        address tokenAddress,
        uint256 amount
    ) external nonReentrant {
        // Validations
        if (amount == 0) revert ZeroAmount();
        if (payee == address(0)) revert InvalidPayee();
        if (tokenAddress == address(0)) revert InvalidPayee();
        if (payments[paymentId].exists) revert PaymentAlreadyExists();
        
        // Transfer tokens to contract
        IERC20 token = IERC20(tokenAddress);
        bool success = token.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();
        
        // Create payment
        payments[paymentId] = Payment({
            payer: msg.sender,
            payee: payee,
            amount: amount,
            createdAt: block.timestamp,
            paymentId: paymentId,
            status: STATUS_SENT,
            tokenAddress: tokenAddress,
            exists: true
        });
        
        // Emit event
        emit PaymentSent(
            paymentId,
            msg.sender,
            payee,
            amount,
            tokenAddress
        );
    }
    
    // Claim payment
    function claim(bytes32 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        
        // Verify payment status and claiming conditions
        if (payment.status != STATUS_SENT) revert NothingToClaim();
        if (msg.sender != payment.payee) revert NotPayee();
        
        // Update status
        payment.status = STATUS_CLAIMED;
        
        // Transfer funds
        if (payment.tokenAddress == address(0)) {
            // ETH payment
            (bool success, ) = payment.payee.call{value: payment.amount}("");
            if (!success) revert TransferFailed();
        } else {
            // ERC20 payment
            IERC20 token = IERC20(payment.tokenAddress);
            bool success = token.transfer(payment.payee, payment.amount);
            if (!success) revert TransferFailed();
        }
        
        // Emit event
        emit PaymentClaimed(
            paymentId,
            msg.sender,
            payment.amount,
            payment.tokenAddress
        );
    }
    
    // Reimburse payment
    function reimburse(bytes32 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        
        // Verify payment status and reimbursement conditions
        if (payment.status != STATUS_SENT) revert CannotReimburse();
        if (msg.sender != payment.payer) revert NotPayer();
        
        // Update status
        payment.status = STATUS_REIMBURSED;
        
        // Transfer funds back
        if (payment.tokenAddress == address(0)) {
            // ETH payment
            (bool success, ) = payment.payer.call{value: payment.amount}("");
            if (!success) revert TransferFailed();
        } else {
            // ERC20 payment
            IERC20 token = IERC20(payment.tokenAddress);
            bool success = token.transfer(payment.payer, payment.amount);
            if (!success) revert TransferFailed();
        }
        
        // Emit event
        emit PaymentReimbursed(
            paymentId,
            msg.sender,
            payment.amount,
            payment.tokenAddress
        );
    }
    
    // View functions
    
    // Check if payment exists
    function paymentExists(bytes32 paymentId) public view returns (bool) {
        return payments[paymentId].exists;
    }
    
    // Check if the payment status is Sent
    function statusIsSent(bytes32 paymentId) public view returns (bool) {
        return payments[paymentId].status == STATUS_SENT;
    }
    
    // Check if the payment status is Claimed
    function statusIsClaimed(bytes32 paymentId) public view returns (bool) {
        return payments[paymentId].status == STATUS_CLAIMED;
    }
    
    // Check if the payment status is Reimbursed
    function statusIsReimbursed(bytes32 paymentId) public view returns (bool) {
        return payments[paymentId].status == STATUS_REIMBURSED;
    }
    
    // Get status as a string
    function statusAsString(bytes32 paymentId) public view returns (string memory) {
        if (payments[paymentId].status == STATUS_SENT) {
            return "Sent";
        } else if (payments[paymentId].status == STATUS_CLAIMED) {
            return "Claimed";
        } else {
            return "Reimbursed";
        }
    }
    
    // Get payment details
    function getPaymentDetails(bytes32 paymentId) public view returns (
        address payer,
        address payee,
        uint256 amount,
        uint256 createdAt,
        string memory status,
        address tokenAddress
    ) {
        Payment storage payment = payments[paymentId];
        return (
            payment.payer,
            payment.payee,
            payment.amount,
            payment.createdAt,
            statusAsString(paymentId),
            payment.tokenAddress
        );
    }
}