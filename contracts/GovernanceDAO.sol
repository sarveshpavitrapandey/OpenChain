
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ScienceDAO
 * @dev Governance DAO for the decentralized scientific publishing platform
 */
contract ScienceDAO is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    using Counters for Counters.Counter;
    
    Counters.Counter private _disputeIds;
    
    // Dispute structure for community moderation
    struct Dispute {
        uint256 id;
        uint256 paperId;
        address submitter;
        string reason;
        uint256 votesFor;
        uint256 votesAgainst;
        bool resolved;
        bool upheld;
        uint256 timestamp;
    }
    
    // Mapping from dispute ID to Dispute struct
    mapping(uint256 => Dispute) private _disputes;
    
    // Mapping from paper ID to dispute IDs
    mapping(uint256 => uint256[]) private _paperDisputes;
    
    // Mapping to track user votes on disputes
    mapping(uint256 => mapping(address => bool)) private _hasVotedOnDispute;
    
    // Events
    event DisputeSubmitted(uint256 indexed disputeId, uint256 indexed paperId, address indexed submitter);
    event DisputeVoteCast(uint256 indexed disputeId, address indexed voter, bool support);
    event DisputeResolved(uint256 indexed disputeId, bool upheld);
    
    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("ScienceDAO")
        GovernorSettings(1 /* 1 block voting delay */, 45818 /* ~1 week voting period */, 50_000 * 10**18 /* 50,000 tokens proposal threshold */)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {}
    
    /**
     * @dev Returns the voting delay (in blocks)
     */
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }
    
    /**
     * @dev Returns the voting period (in blocks)
     */
    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }
    
    /**
     * @dev Returns the proposal threshold (min tokens needed to create proposal)
     */
    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }
    
    /**
     * @dev Returns the quorum required for a proposal to pass
     */
    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }
    
    /**
     * @dev Overridden to support quadratic voting
     */
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight,
        bytes memory // params
    ) internal override(Governor, GovernorCountingSimple) {
        // Calculate square root of weight for quadratic voting
        uint256 voteWeight = sqrt(weight);
        super._countVote(proposalId, account, support, voteWeight, "");
    }
    
    /**
     * @dev Calculate the square root of a number (for quadratic voting)
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    
    // The following functions are overrides required by Solidity
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Submit a dispute for community moderation
     * @param _paperId The ID of the paper in dispute
     * @param _reason The reason for the dispute
     * @return disputeId The ID of the newly submitted dispute
     */
    function submitDispute(uint256 _paperId, string memory _reason) 
        public 
        returns (uint256) 
    {
        require(bytes(_reason).length > 0, "Reason cannot be empty");
        
        _disputeIds.increment();
        uint256 disputeId = _disputeIds.current();
        
        Dispute memory newDispute = Dispute({
            id: disputeId,
            paperId: _paperId,
            submitter: msg.sender,
            reason: _reason,
            votesFor: 0,
            votesAgainst: 0,
            resolved: false,
            upheld: false,
            timestamp: block.timestamp
        });
        
        _disputes[disputeId] = newDispute;
        _paperDisputes[_paperId].push(disputeId);
        
        emit DisputeSubmitted(disputeId, _paperId, msg.sender);
        
        return disputeId;
    }
    
    /**
     * @dev Vote on a dispute
     * @param _disputeId The ID of the dispute to vote on
     * @param _support Whether to support the dispute
     */
    function voteOnDispute(uint256 _disputeId, bool _support) 
        public 
        returns (bool)
    {
        require(_disputeId > 0 && _disputeId <= _disputeIds.current(), "Dispute does not exist");
        require(!_disputes[_disputeId].resolved, "Dispute already resolved");
        require(!_hasVotedOnDispute[_disputeId][msg.sender], "Already voted on this dispute");
        
        _hasVotedOnDispute[_disputeId][msg.sender] = true;
        
        // Get voting power through the governance token
        uint256 weight = getVotes(msg.sender, block.number - 1);
        
        // Apply quadratic voting
        uint256 voteWeight = sqrt(weight);
        
        if (_support) {
            _disputes[_disputeId].votesFor += voteWeight;
        } else {
            _disputes[_disputeId].votesAgainst += voteWeight;
        }
        
        emit DisputeVoteCast(_disputeId, msg.sender, _support);
        
        // Auto-resolve if threshold met
        if (_disputes[_disputeId].votesFor >= 100 * 10**18 || _disputes[_disputeId].votesAgainst >= 100 * 10**18) {
            resolveDispute(_disputeId);
        }
        
        return true;
    }
    
    /**
     * @dev Resolve a dispute based on voting results
     * @param _disputeId The ID of the dispute to resolve
     */
    function resolveDispute(uint256 _disputeId) 
        public 
    {
        require(_disputeId > 0 && _disputeId <= _disputeIds.current(), "Dispute does not exist");
        require(!_disputes[_disputeId].resolved, "Dispute already resolved");
        
        Dispute storage dispute = _disputes[_disputeId];
        dispute.resolved = true;
        
        // Determine if dispute is upheld based on votes
        if (dispute.votesFor > dispute.votesAgainst) {
            dispute.upheld = true;
        } else {
            dispute.upheld = false;
        }
        
        emit DisputeResolved(_disputeId, dispute.upheld);
    }
    
    /**
     * @dev Get a dispute by its ID
     * @param _disputeId The ID of the dispute
     * @return Dispute struct containing the dispute's details
     */
    function getDispute(uint256 _disputeId) 
        public 
        view 
        returns (Dispute memory) 
    {
        require(_disputeId > 0 && _disputeId <= _disputeIds.current(), "Dispute does not exist");
        return _disputes[_disputeId];
    }
    
    /**
     * @dev Get all disputes for a paper
     * @param _paperId The ID of the paper
     * @return Array of dispute IDs for the given paper
     */
    function getDisputesByPaper(uint256 _paperId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _paperDisputes[_paperId];
    }
    
    /**
     * @dev Check if an address has voted on a dispute
     * @param _disputeId The ID of the dispute
     * @param _voter The address to check
     * @return bool True if the address has voted on the dispute
     */
    function hasVotedOnDispute(uint256 _disputeId, address _voter) 
        public 
        view 
        returns (bool) 
    {
        return _hasVotedOnDispute[_disputeId][_voter];
    }
}
