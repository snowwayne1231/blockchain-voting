pragma solidity >=0.4.22;

//建立 Contract :VoteCon3
contract VoteCon3 {

    struct Voter {
        uint weight; 
        bool voted; 
        address delegate; 
        uint vote;  
    }

    struct Proposal {
        bytes32 name;   
        uint voteCount; 
    }

    struct IDValidation {
        address voter;
        string phone;
        bool validated;
        uint code;
    }
    
    address public chairperson;

   
    mapping(address => Voter) public voters;
    mapping(string => IDValidation) private iddatasets;

    Proposal[] public proposals;

    event SendMessage(string phone, uint code);

    bool public lock;
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        lock = false;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    function giveValidateId(string memory phonenum, string memory id) public {
        require(voters[msg.sender].weight == 0, "already has weight");
        require(!iddatasets[id].validated, "already validated.");
        iddatasets[id].phone = phonenum;
        iddatasets[id].voter = msg.sender;
        iddatasets[id].code = block.timestamp % 10000;
        emit SendMessage(phonenum, iddatasets[id].code);
    }

    function getValidateCode(string memory id) public view returns(uint code_) {
        require(msg.sender == chairperson, "not chairperson");
        code_ =  iddatasets[id].code;
    }

    function validate(string memory id, uint code) public {
        require(iddatasets[id].code == code, "code not matched.");
        require(iddatasets[id].voter == msg.sender, "voter is not sender address.");
        iddatasets[id].validated = true;
        voters[msg.sender].weight = 1;
    }
    
    function setLock(bool _lock) public {
        require(msg.sender == chairperson, "not chairperson");
        lock = _lock;
    }

    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");
        
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }       

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }


    function vote(uint proposal) public {
        require(lock == false, "vote is locked.");
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        require(lock==true, "vote not locked.");
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        require(lock==true, "vote not locked.");
        winnerName_ = proposals[winningProposal()].name;
    }
}
