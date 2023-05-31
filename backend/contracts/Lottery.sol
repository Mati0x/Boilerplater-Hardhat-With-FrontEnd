// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./LotteryToken.sol";

/// @title A very simple lottery contract with a FrontEnd in React
/// @author Matias and
/// @notice You can use this contract for running a very simple lottery
/// @dev This contract implements a relatively weak randomness source, since there is no cliff period between the randao reveal and the actual usage in this contract
/// @custom:teaching This is a contract meant for teaching only

contract Lottery is Ownable {
    /// @notice Address of the token used as payment for the bets
    LotteryToken public paymentToken;
    /// @notice Amount of tokens given per ETH paid
    uint256 public purchaseRatio;
    /// @notice Amount of tokens required for placing a bet that goes for the prize pool
    uint256 public betPrice;
    /// @notice Amount of tokens required for placing a bet that goes for the owner pool
    uint256 public betFee;
    /// @notice Flag indicating whether the lottery is open for bets or not
    bool public betsOpen;
    /// @notice Timestamp of the lottery next closing date and time
    uint256 public betsClosingTime;
    /// @notice Amount of tokens in the prize pool
    uint256 public prizePool;
    /// @notice Amount of tokens in the owner pool
    uint256 public ownerPool;

    /// @notice Mapping of prize available for withdraw for each account
    mapping(address => uint256) public prize;

    /// @dev List of bet slots, it is and array and NOT a mapping because be can have moultiple bets per address
    address[] _slots;

    /// @notice Constructor function
    /// @param tokenName Name of the token used for payment
    /// @param tokenSymbol Symbol of the token used for payment
    /// @param _purchaseRatio Amount of tokens given per ETH paid
    /// @param _betPrice Amount of tokens required for placing a bet that goes for the prize pool
    /// @param _betFee Amount of tokens required for placing a bet that goes for the owner pool
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _purchaseRatio,
        uint256 _betPrice,
        uint256 _betFee
    ) {
        ///@dev This way of deploying two smart contract in one constructor is only a way, maybe it is not the optimal way, check this https://blog.logrocket.com/cloning-solidity-smart-contracts-factory-pattern/
        paymentToken = new LotteryToken(tokenName, tokenSymbol);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;
    }

    /// @notice Passes when the lottery is at closed state
    modifier whenBetsClosed() {
        ///@dev The condition being checked is !betsOpen, which means the boolean variable betsOpen must be false for the condition to pass.
        require(!betsOpen, "Lottery is open");
        _;
    }
    /// @notice Passes when the lottery is at open state and the current block timestamp is lower than the lottery closing date
    modifier whenBetsOpen() {
        require(
            betsOpen && block.timestamp < betsClosingTime,
            "Lottery is closed"
        );
        _;
    }

    /// @notice Opens the lottery for bets
    function openBets(uint256 closingTime) external onlyOwner whenBetsClosed {
        require(
            closingTime > block.timestamp,
            "Closing time must be in the future"
        );
        betsClosingTime = closingTime;
        betsOpen = true;
    }

    /// @notice Gives tokens based on the amount of ETH sent
    /// @dev This implementation is prone to rounding problems
    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    /// @notice Burns `amount` tokens and give the equivalent ETH back to user
    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / purchaseRatio);
    }

    /// @notice Charges the bet price and creates a new bet slot with the sender's address
    function bet() public whenBetsOpen {
        ownerPool += betFee;
        prizePool += betPrice;
        _slots.push(msg.sender);
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
    }

    /// @notice Calls the bet function `times` times
    function betMany(uint256 times) external {
        require(times > 0);
        while (times > 0) {
            bet();
            times--;
        }
    }

    /// @notice Closes the lottery and calculates the prize, if any
    /// @dev Anyone can call this function at any time after the closing time
    function closeLottery() external {
        require(block.timestamp >= betsClosingTime, "Lottery is not closed");
        require(betsOpen, "Lottery is not open");
        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete (_slots);
        }
        betsOpen = false;
    }

    /// @notice Returns a random number calculated from the previous block randao
    /// @dev This only works after The Merge
    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.prevrandao;
    }

    /// @notice Withdraws `amount` from that accounts's prize pool

    function prizeWithdraw(uint256 amount) external {
        require(amount >= prize[msg.sender], "Not enough prize Sir!");
        prize[msg.sender] -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    /// @notice Withdraws `amount` from the owner's pool
    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(amount <= ownerPool, "Not enough fees collected Sir!");
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }
}
