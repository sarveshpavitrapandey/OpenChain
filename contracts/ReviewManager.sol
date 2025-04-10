
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ReviewManager
 * @dev Contract for managing peer reviews of scientific papers
 */
contract ReviewManager is AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    Counters.Counter private _reviewIds;
    
    enum ReviewStatus { Pending, Accepted, Rejected, Disputed }
    
    struct Review {
        uint256 id;
        uint256 paperId;
        address reviewer;
        string reviewCid;  // IPFS Content Identifier for the review
        uint8 rating;      // Rating between 1-5
        uint256 timestamp;
        ReviewStatus status;
        bool rewarded;     // Whether the reviewer has been rewarded
    }
    
    // Mapping from review ID to Review struct
    mapping(uint256 => Review) private _reviews;
    
    // Mapping from paper ID to array of its review IDs
    mapping(uint256 => uint256[]) private _paperReviews;
    
    // Mapping from reviewer address to array of their review IDs
    mapping(address => uint256[]) private _reviewerHistory;
    
    // Mapping from reviewer address to their reputation score
    mapping(address => uint256) private _reviewerReputation;
    
    // Events
    event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed paperId, address indexed reviewer);
    event ReviewStatusChanged(uint256 indexed reviewId, ReviewStatus status);
    event ReviewerRewarded(uint256 indexed reviewId, address indexed reviewer, uint256 amount);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Submit a new review for a paper
     * @param _paperId The ID of the paper being reviewed
     * @param _reviewCid IPFS Content Identifier of the review
     * @param _rating Rating between 1-5
     * @return reviewId The ID of the newly submitted review
     */
    function submitReview(uint256 _paperId, string memory _reviewCid, uint8 _rating) 
        public 
        returns (uint256) 
    {
        require(hasRole(REVIEWER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 
                "Must have reviewer role");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(bytes(_reviewCid).length > 0, "Review CID cannot be empty");
        
        _reviewIds.increment();
        uint256 reviewId = _reviewIds.current();
        
        Review memory newReview = Review({
            id: reviewId,
            paperId: _paperId,
            reviewer: msg.sender,
            reviewCid: _reviewCid,
            rating: _rating,
            timestamp: block.timestamp,
            status: ReviewStatus.Pending,
            rewarded: false
        });
        
        _reviews[reviewId] = newReview;
        _paperReviews[_paperId].push(reviewId);
        _reviewerHistory[msg.sender].push(reviewId);
        
        // Update reviewer reputation (simple implementation)
        _reviewerReputation[msg.sender] += 1;
        
        emit ReviewSubmitted(reviewId, _paperId, msg.sender);
        
        return reviewId;
    }
    
    /**
     * @dev Get a review by its ID
     * @param _reviewId The ID of the review
     * @return Review struct containing the review's details
     */
    function getReview(uint256 _reviewId) 
        public 
        view 
        returns (Review memory) 
    {
        require(_reviewId > 0 && _reviewId <= _reviewIds.current(), "Review does not exist");
        return _reviews[_reviewId];
    }
    
    /**
     * @dev Get all reviews for a paper
     * @param _paperId The ID of the paper
     * @return Array of review IDs for the given paper
     */
    function getReviewsByPaper(uint256 _paperId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _paperReviews[_paperId];
    }
    
    /**
     * @dev Get all reviews submitted by a reviewer
     * @param _reviewer The address of the reviewer
     * @return Array of review IDs submitted by the given reviewer
     */
    function getReviewsByReviewer(address _reviewer) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _reviewerHistory[_reviewer];
    }
    
    /**
     * @dev Update the status of a review
     * @param _reviewId The ID of the review
     * @param _status The new status for the review
     */
    function updateReviewStatus(uint256 _reviewId, ReviewStatus _status) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(_reviewId > 0 && _reviewId <= _reviewIds.current(), "Review does not exist");
        
        _reviews[_reviewId].status = _status;
        
        emit ReviewStatusChanged(_reviewId, _status);
        
        // Update reviewer reputation based on status
        if (_status == ReviewStatus.Accepted) {
            _reviewerReputation[_reviews[_reviewId].reviewer] += 2;
        } else if (_status == ReviewStatus.Rejected) {
            if (_reviewerReputation[_reviews[_reviewId].reviewer] > 1) {
                _reviewerReputation[_reviews[_reviewId].reviewer] -= 1;
            }
        }
    }
    
    /**
     * @dev Mark a review as rewarded
     * @param _reviewId The ID of the review
     * @param _amount The amount of tokens rewarded
     */
    function markReviewRewarded(uint256 _reviewId, uint256 _amount) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(_reviewId > 0 && _reviewId <= _reviewIds.current(), "Review does not exist");
        require(!_reviews[_reviewId].rewarded, "Review already rewarded");
        
        _reviews[_reviewId].rewarded = true;
        
        emit ReviewerRewarded(_reviewId, _reviews[_reviewId].reviewer, _amount);
    }
    
    /**
     * @dev Get the reputation score of a reviewer
     * @param _reviewer The address of the reviewer
     * @return The reputation score of the reviewer
     */
    function getReviewerReputation(address _reviewer) 
        public 
        view 
        returns (uint256) 
    {
        return _reviewerReputation[_reviewer];
    }
    
    /**
     * @dev Manually adjust reviewer reputation (admin only)
     * @param _reviewer The address of the reviewer
     * @param _adjustment The adjustment to make (positive or negative)
     * @param _increase Whether to increase or decrease reputation
     */
    function adjustReviewerReputation(address _reviewer, uint256 _adjustment, bool _increase) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (_increase) {
            _reviewerReputation[_reviewer] += _adjustment;
        } else {
            if (_reviewerReputation[_reviewer] > _adjustment) {
                _reviewerReputation[_reviewer] -= _adjustment;
            } else {
                _reviewerReputation[_reviewer] = 0;
            }
        }
    }
    
    /**
     * @dev Grant reviewer role to an address
     * @param _account The address to grant the role to
     */
    function addReviewer(address _account) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        grantRole(REVIEWER_ROLE, _account);
    }
    
    /**
     * @dev Revoke reviewer role from an address
     * @param _account The address to revoke the role from
     */
    function removeReviewer(address _account) 
        public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        revokeRole(REVIEWER_ROLE, _account);
    }
}
