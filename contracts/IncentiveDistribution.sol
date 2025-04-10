
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";
import "./ReviewManager.sol";

/**
 * @title IncentiveDistribution
 * @dev Contract for managing token incentives for authors, reviewers, and other participants
 */
contract IncentiveDistribution is AccessControl {
    using SafeMath for uint256;
    
    // Roles
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    
    // Contracts
    ScienceToken public token;
    ReviewManager public reviewManager;
    
    // Incentive parameters
    uint256 public authorSubmissionReward = 100 * 10**18;  // 100 tokens for paper submission
    uint256 public reviewerBaseReward = 20 * 10**18;       // 20 tokens for submitting a review
    uint256 public readerInteractionReward = 5 * 10**18;   // 5 tokens for meaningful reader interactions
    uint256 public citationReward = 25 * 10**18;          // 25 tokens for each citation received
    
    // Tracking mappings
    mapping(uint256 => bool) private _papersRewarded;
    mapping(uint256 => mapping(address => bool)) private _readerRewarded;
    mapping(uint256 => mapping(uint256 => bool)) private _citationRewarded;
    mapping(address => uint256) public lastRewardTime;
    uint256 public rewardCooldownPeriod = 1 days;
    
    // Events
    event AuthorRewarded(address indexed author, uint256 indexed paperId, uint256 amount);
    event ReviewerRewarded(address indexed reviewer, uint256 indexed reviewId, uint256 amount);
    event ReaderRewarded(address indexed reader, uint256 indexed paperId, uint256 amount);
    event CitationRewarded(address indexed author, uint256 indexed paperId, uint256 indexed citingPaperId, uint256 amount);
    event IncentiveParameterUpdated(string paramName, uint256 oldValue, uint256 newValue);
    
    constructor(address _tokenAddress, address _reviewManagerAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        
        token = ScienceToken(_tokenAddress);
        reviewManager = ReviewManager(_reviewManagerAddress);
    }
    
    /**
     * @dev Reward an author for submitting a paper
     * @param _author The address of the author
     * @param _paperId The ID of the submitted paper
     */
    function rewardAuthor(address _author, uint256 _paperId) 
        public 
        onlyRole(DISTRIBUTOR_ROLE) 
    {
        require(!_papersRewarded[_paperId], "Author already rewarded for this paper");
        require(lastRewardTime[_author] + rewardCooldownPeriod <= block.timestamp, "Reward cooldown period not elapsed");
        
        _papersRewarded[_paperId] = true;
        lastRewardTime[_author] = block.timestamp;
        
        token.distributeReward(_author, authorSubmissionReward, "Paper submission");
        
        emit AuthorRewarded(_author, _paperId, authorSubmissionReward);
    }
    
    /**
     * @dev Reward a reviewer for submitting a review
     * @param _reviewer The address of the reviewer
     * @param _reviewId The ID of the submitted review
     */
    function rewardReviewer(address _reviewer, uint256 _reviewId) 
        public 
        onlyRole(DISTRIBUTOR_ROLE) 
    {
        require(lastRewardTime[_reviewer] + rewardCooldownPeriod <= block.timestamp, "Reward cooldown period not elapsed");
        
        // Get reviewer reputation to adjust reward
        uint256 reputation = reviewManager.getReviewerReputation(_reviewer);
        uint256 reputationBonus = (reputation > 10) ? reputation.div(10) : 0;
        uint256 totalReward = reviewerBaseReward.add(reputationBonus * 10**18);
        
        lastRewardTime[_reviewer] = block.timestamp;
        
        token.distributeReward(_reviewer, totalReward, "Review submission");
        
        // Mark review as rewarded in ReviewManager
        reviewManager.markReviewRewarded(_reviewId, totalReward);
        
        emit ReviewerRewarded(_reviewer, _reviewId, totalReward);
    }
    
    /**
     * @dev Reward a reader for meaningful interaction with a paper
     * @param _reader The address of the reader
     * @param _paperId The ID of the paper being interacted with
     */
    function rewardReader(address _reader, uint256 _paperId) 
        public 
        onlyRole(DISTRIBUTOR_ROLE) 
    {
        require(!_readerRewarded[_paperId][_reader], "Reader already rewarded for this paper");
        require(lastRewardTime[_reader] + rewardCooldownPeriod <= block.timestamp, "Reward cooldown period not elapsed");
        
        _readerRewarded[_paperId][_reader] = true;
        lastRewardTime[_reader] = block.timestamp;
        
        token.distributeReward(_reader, readerInteractionReward, "Paper interaction");
        
        emit ReaderRewarded(_reader, _paperId, readerInteractionReward);
    }
    
    /**
     * @dev Reward an author for receiving a citation
     * @param _author The address of the author being cited
     * @param _paperId The ID of the cited paper
     * @param _citingPaperId The ID of the paper that includes the citation
     */
    function rewardCitation(address _author, uint256 _paperId, uint256 _citingPaperId) 
        public 
        onlyRole(DISTRIBUTOR_ROLE) 
    {
        require(!_citationRewarded[_paperId][_citingPaperId], "Citation already rewarded");
        
        _citationRewarded[_paperId][_citingPaperId] = true;
        
        token.distributeReward(_author, citationReward, "Paper citation");
        
        emit CitationRewarded(_author, _paperId, _citingPaperId, citationReward);
    }
    
    /**
     * @dev Check if an author has been rewarded for a paper
     * @param _paperId The ID of the paper
     * @return bool True if the author has been rewarded
     */
    function isAuthorRewarded(uint256 _paperId) 
        public 
        view 
        returns (bool) 
    {
        return _papersRewarded[_paperId];
    }
    
    /**
     * @dev Check if a reader has been rewarded for interacting with a paper
     * @param _paperId The ID of the paper
     * @param _reader The address of the reader
     * @return bool True if the reader has been rewarded
     */
    function isReaderRewarded(uint256 _paperId, address _reader) 
        public 
        view 
        returns (bool) 
    {
        return _readerRewarded[_paperId][_reader];
    }
    
    /**
     * @dev Check if a citation has been rewarded
     * @param _paperId The ID of the cited paper
     * @param _citingPaperId The ID of the citing paper
     * @return bool True if the citation has been rewarded
     */
    function isCitationRewarded(uint256 _paperId, uint256 _citingPaperId) 
        public 
        view 
        returns (bool) 
    {
        return _citationRewarded[_paperId][_citingPaperId];
    }
    
    /**
     * @dev Update the author submission reward
     * @param _newReward The new reward amount in tokens
     */
    function updateAuthorSubmissionReward(uint256 _newReward) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        uint256 oldReward = authorSubmissionReward;
        authorSubmissionReward = _newReward;
        emit IncentiveParameterUpdated("authorSubmissionReward", oldReward, _newReward);
    }
    
    /**
     * @dev Update the reviewer base reward
     * @param _newReward The new reward amount in tokens
     */
    function updateReviewerBaseReward(uint256 _newReward) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        uint256 oldReward = reviewerBaseReward;
        reviewerBaseReward = _newReward;
        emit IncentiveParameterUpdated("reviewerBaseReward", oldReward, _newReward);
    }
    
    /**
     * @dev Update the reader interaction reward
     * @param _newReward The new reward amount in tokens
     */
    function updateReaderInteractionReward(uint256 _newReward) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        uint256 oldReward = readerInteractionReward;
        readerInteractionReward = _newReward;
        emit IncentiveParameterUpdated("readerInteractionReward", oldReward, _newReward);
    }
    
    /**
     * @dev Update the citation reward
     * @param _newReward The new reward amount in tokens
     */
    function updateCitationReward(uint256 _newReward) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        uint256 oldReward = citationReward;
        citationReward = _newReward;
        emit IncentiveParameterUpdated("citationReward", oldReward, _newReward);
    }
    
    /**
     * @dev Update the reward cooldown period
     * @param _newPeriod The new cooldown period in seconds
     */
    function updateRewardCooldownPeriod(uint256 _newPeriod) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        uint256 oldPeriod = rewardCooldownPeriod;
        rewardCooldownPeriod = _newPeriod;
        emit IncentiveParameterUpdated("rewardCooldownPeriod", oldPeriod, _newPeriod);
    }
    
    /**
     * @dev Set the token contract address
     * @param _tokenAddress The address of the token contract
     */
    function setTokenContract(address _tokenAddress) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        token = ScienceToken(_tokenAddress);
    }
    
    /**
     * @dev Set the review manager contract address
     * @param _reviewManagerAddress The address of the review manager contract
     */
    function setReviewManagerContract(address _reviewManagerAddress) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        reviewManager = ReviewManager(_reviewManagerAddress);
    }
}
