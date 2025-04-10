
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PaperSubmission
 * @dev Contract for submitting and managing scientific papers on the blockchain
 */
contract PaperSubmission is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _paperIds;

    struct Paper {
        uint256 id;
        string cid;        // IPFS Content Identifier
        string title;
        address author;
        uint256 timestamp;
        bool isVerified;
        bytes signature;   // Author's signature for verification
    }

    // Mapping from paper ID to Paper struct
    mapping(uint256 => Paper) private _papers;
    
    // Mapping from IPFS CID to paper ID
    mapping(string => uint256) private _cidToPaperId;
    
    // Mapping from author address to array of their paper IDs
    mapping(address => uint256[]) private _authorPapers;

    // Events
    event PaperSubmitted(uint256 indexed paperId, string cid, string title, address indexed author);
    event PaperVerified(uint256 indexed paperId, string cid);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Submit a new scientific paper with its metadata
     * @param _cid IPFS Content Identifier of the paper
     * @param _title Title of the paper
     * @param _signature Digital signature verifying the author
     * @return paperId The ID of the newly submitted paper
     */
    function submitPaper(string memory _cid, string memory _title, bytes memory _signature) 
        public 
        returns (uint256) 
    {
        require(bytes(_cid).length > 0, "CID cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_cidToPaperId[_cid] == 0, "Paper with this CID already exists");

        _paperIds.increment();
        uint256 paperId = _paperIds.current();
        
        Paper memory newPaper = Paper({
            id: paperId,
            cid: _cid,
            title: _title,
            author: msg.sender,
            timestamp: block.timestamp,
            isVerified: false,
            signature: _signature
        });
        
        _papers[paperId] = newPaper;
        _cidToPaperId[_cid] = paperId;
        _authorPapers[msg.sender].push(paperId);
        
        emit PaperSubmitted(paperId, _cid, _title, msg.sender);
        
        return paperId;
    }

    /**
     * @dev Verify that a paper's signature matches its author
     * @param _paperId The ID of the paper to verify
     * @param _message The original message that was signed (typically cid:title)
     * @return bool True if the signature is valid, false otherwise
     */
    function verifyPaperSignature(uint256 _paperId, string memory _message) 
        public 
        view
        returns (bool) 
    {
        Paper storage paper = _papers[_paperId];
        require(paper.id != 0, "Paper does not exist");
        
        // Recreate the message hash that was signed
        bytes32 messageHash = keccak256(abi.encodePacked(_message));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        
        // Recover the signer address from the signature
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(paper.signature);
        address recoveredAddress = ecrecover(ethSignedMessageHash, v, r, s);
        
        return recoveredAddress == paper.author;
    }

    /**
     * @dev Split a signature into its r, s, v components
     * @param sig The signature to split
     * @return r, s, v The signature components
     */
    function splitSignature(bytes memory sig) 
        internal 
        pure 
        returns (bytes32 r, bytes32 s, uint8 v) 
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        return (r, s, v);
    }

    /**
     * @dev Get a paper by its ID
     * @param _paperId The ID of the paper
     * @return Paper struct containing the paper's details
     */
    function getPaper(uint256 _paperId) 
        public 
        view 
        returns (Paper memory) 
    {
        require(_paperId > 0 && _paperId <= _paperIds.current(), "Paper does not exist");
        return _papers[_paperId];
    }

    /**
     * @dev Get all papers submitted by a specific author
     * @param _author The address of the author
     * @return Array of paper IDs authored by the given address
     */
    function getPapersByAuthor(address _author) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _authorPapers[_author];
    }

    /**
     * @dev Get the total number of papers submitted
     * @return The total count of papers
     */
    function getPaperCount() 
        public 
        view 
        returns (uint256) 
    {
        return _paperIds.current();
    }

    /**
     * @dev Mark a paper as verified (only callable by contract owner)
     * @param _paperId The ID of the paper to verify
     */
    function verifyPaper(uint256 _paperId) 
        public 
        onlyOwner 
    {
        require(_paperId > 0 && _paperId <= _paperIds.current(), "Paper does not exist");
        require(!_papers[_paperId].isVerified, "Paper is already verified");
        
        _papers[_paperId].isVerified = true;
        
        emit PaperVerified(_paperId, _papers[_paperId].cid);
    }
}
