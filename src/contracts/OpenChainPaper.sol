
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title OpenChain Research Paper Contract
 * @dev Smart contract for managing research papers on the OpenChain platform with DAO governance
 */
contract OpenChainPaper {
    using ECDSA for bytes32;

    // Token details
    string public name = "OpenChain Token";
    string public symbol = "OCT";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18; // 1 million tokens
    
    // Paper struct
    struct Paper {
        string cid;
        string title;
        address author;
        uint256 timestamp;
        uint256 rewardAmount;
        bool exists;
    }
    
    // Review struct
    struct Review {
        string cid;
        address reviewer;
        uint256 rating;
        uint256 timestamp;
        uint256 rewardAmount;
        bool exists;
    }
    
    // Proposal struct for DAO governance
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool exists;
    }
    
    // Dispute struct for community moderation
    struct Dispute {
        uint256 id;
        bytes32 paperId;
        address initiator;
        string reason;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool resolved;
        bool exists;
    }
    
    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(bytes32 => Paper) public papers;
    mapping(bytes32 => mapping(address => Review)) public reviews;
    mapping(bytes32 => address[]) public paperReviewers;
    
    // DAO Governance mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVotedOnProposal;
    mapping(address => uint256) public reviewerReputation;
    
    // Dispute resolution mappings
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => mapping(address => bool)) public hasVotedOnDispute;
    
    // Counters
    uint256 public proposalCount = 0;
    uint256 public disputeCount = 0;
    
    // Constants
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_TOKENS_TO_PROPOSE = 10 * 10**18; // 10 tokens
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event PaperPublished(bytes32 indexed paperId, string cid, string title, address indexed author);
    event ReviewSubmitted(bytes32 indexed paperId, address indexed reviewer, uint256 rating);
    
    // DAO Governance events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event ProposalVoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event DisputeSubmitted(uint256 indexed disputeId, bytes32 indexed paperId, address indexed initiator);
    event DisputeVoteCast(uint256 indexed disputeId, address indexed voter, bool support, uint256 weight);
    
    // Constructor
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    // Transfer tokens
    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        
        return true;
    }
    
    // Verify if a signature is valid
    function verifySignature(string memory message, bytes memory signature, address signer) public pure returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        return recoveredSigner == signer;
    }
    
    // Publish a paper with signature verification
    function publishPaper(string memory cid, string memory title, bytes memory signature) public returns (bytes32) {
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        // Create message hash for verification (cid + title)
        string memory message = string(abi.encodePacked(cid, ":", title));
        require(verifySignature(message, signature, msg.sender), "Invalid signature");
        
        bytes32 paperId = keccak256(abi.encodePacked(cid, msg.sender, block.timestamp));
        
        // Ensure paper doesn't already exist
        require(!papers[paperId].exists, "Paper already exists");
        
        uint256 reward = 50 * 10**18; // 50 tokens reward
        
        // Create new paper entry
        papers[paperId] = Paper({
            cid: cid,
            title: title,
            author: msg.sender,
            timestamp: block.timestamp,
            rewardAmount: reward,
            exists: true
        });
        
        // Reward the author
        require(balanceOf[address(this)] >= reward, "Contract has insufficient tokens for reward");
        balanceOf[address(this)] -= reward;
        balanceOf[msg.sender] += reward;
        
        // Increase author's reputation
        reviewerReputation[msg.sender] += 5;
        
        emit Transfer(address(this), msg.sender, reward);
        emit PaperPublished(paperId, cid, title, msg.sender);
        
        return paperId;
    }
    
    // Submit a review
    function submitReview(bytes32 paperId, string memory cid, uint256 rating) public returns (bool) {
        require(papers[paperId].exists, "Paper does not exist");
        require(papers[paperId].author != msg.sender, "Authors cannot review their own papers");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(!reviews[paperId][msg.sender].exists, "You have already reviewed this paper");
        
        uint256 reward = 10 * 10**18; // 10 tokens reward
        
        // Create new review entry
        reviews[paperId][msg.sender] = Review({
            cid: cid,
            reviewer: msg.sender,
            rating: rating,
            timestamp: block.timestamp,
            rewardAmount: reward,
            exists: true
        });
        
        // Add reviewer to the list
        paperReviewers[paperId].push(msg.sender);
        
        // Reward the reviewer
        require(balanceOf[address(this)] >= reward, "Contract has insufficient tokens for reward");
        balanceOf[address(this)] -= reward;
        balanceOf[msg.sender] += reward;
        
        // Increase reviewer's reputation
        reviewerReputation[msg.sender] += 2;
        
        emit Transfer(address(this), msg.sender, reward);
        emit ReviewSubmitted(paperId, msg.sender, rating);
        
        return true;
    }
    
    // Get token balance
    function getTokenBalance(address user) public view returns (uint256) {
        return balanceOf[user];
    }
    
    // Get paper reviewers
    function getPaperReviewers(bytes32 paperId) public view returns (address[] memory) {
        return paperReviewers[paperId];
    }
    
    // Calculate voting weight using quadratic/token-weighted voting
    function calculateVotingWeight(address voter) public view returns (uint256) {
        // Square root of token balance for quadratic voting
        // For simplicity, we use a rough approximation
        uint256 balance = balanceOf[voter] / 10**18; // Convert to whole tokens
        uint256 weight = sqrt(balance) + reviewerReputation[voter];
        
        // Ensure minimum voting weight of 1
        return weight > 0 ? weight : 1;
    }
    
    // Rough square root calculation
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        
        return y;
    }
    
    // Submit a proposal for DAO voting
    function submitProposal(string memory title, string memory description) public returns (uint256) {
        require(balanceOf[msg.sender] >= MIN_TOKENS_TO_PROPOSE, "Insufficient tokens to create proposal");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        uint256 proposalId = proposalCount++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            title: title,
            description: description,
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            executed: false,
            exists: true
        });
        
        // Increase proposer's reputation
        reviewerReputation[msg.sender] += 1;
        
        emit ProposalCreated(proposalId, msg.sender, title);
        
        return proposalId;
    }
    
    // Cast vote on a proposal using quadratic voting
    function castVote(uint256 proposalId, bool support) public returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVotedOnProposal[proposalId][msg.sender], "Already voted on this proposal");
        
        // Calculate voting weight using quadratic formula
        uint256 weight = calculateVotingWeight(msg.sender);
        
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }
        
        // Mark as voted
        hasVotedOnProposal[proposalId][msg.sender] = true;
        
        // Increase voter's reputation
        reviewerReputation[msg.sender] += 1;
        
        emit ProposalVoteCast(proposalId, msg.sender, support, weight);
        
        return true;
    }
    
    // Submit a dispute for community moderation
    function submitDispute(bytes32 paperId, string memory reason) public returns (uint256) {
        require(papers[paperId].exists, "Paper does not exist");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        
        uint256 disputeId = disputeCount++;
        
        disputes[disputeId] = Dispute({
            id: disputeId,
            paperId: paperId,
            initiator: msg.sender,
            reason: reason,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            resolved: false,
            exists: true
        });
        
        emit DisputeSubmitted(disputeId, paperId, msg.sender);
        
        return disputeId;
    }
    
    // Vote on a dispute resolution using reputation-weighted voting
    function voteOnDispute(uint256 disputeId, bool support) public returns (bool) {
        Dispute storage dispute = disputes[disputeId];
        
        require(dispute.exists, "Dispute does not exist");
        require(block.timestamp < dispute.endTime, "Voting period has ended");
        require(!hasVotedOnDispute[disputeId][msg.sender], "Already voted on this dispute");
        
        // Calculate voting weight using reputation and quadratic formula
        uint256 weight = calculateVotingWeight(msg.sender);
        
        if (support) {
            dispute.votesFor += weight;
        } else {
            dispute.votesAgainst += weight;
        }
        
        // Mark as voted
        hasVotedOnDispute[disputeId][msg.sender] = true;
        
        // Increase voter's reputation for participating in moderation
        reviewerReputation[msg.sender] += 1;
        
        emit DisputeVoteCast(disputeId, msg.sender, support, weight);
        
        return true;
    }
    
    // Get the reputation score of a reviewer
    function getReviewerReputation(address reviewer) public view returns (uint256) {
        return reviewerReputation[reviewer];
    }
    
    // Get proposal by ID
    function getProposalById(uint256 proposalId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        address proposer,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.proposer,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
    
    // Get the number of proposals
    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }
    
    // Get dispute by ID
    function getDisputeById(uint256 disputeId) public view returns (
        uint256 id,
        bytes32 paperId,
        address initiator,
        string memory reason,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool resolved
    ) {
        Dispute storage dispute = disputes[disputeId];
        require(dispute.exists, "Dispute does not exist");
        
        return (
            dispute.id,
            dispute.paperId,
            dispute.initiator,
            dispute.reason,
            dispute.votesFor,
            dispute.votesAgainst,
            dispute.startTime,
            dispute.endTime,
            dispute.resolved
        );
    }
    
    // Get the number of disputes
    function getDisputeCount() public view returns (uint256) {
        return disputeCount;
    }
}
