// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
/*
      /$$$$$$            /$$$$$$$   /$$$$$$   /$$$$$$
     /$$__  $$          | $$__  $$ /$$__  $$ /$$__  $$
    | $$  \__/ /$$   /$$| $$  \ $$| $$  \ $$| $$  \ $$
    |  $$$$$$ | $$  | $$| $$  | $$| $$$$$$$$| $$  | $$
     \____  $$| $$  | $$| $$  | $$| $$__  $$| $$  | $$
     /$$  \ $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$
    |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$  | $$|  $$$$$$/
     \______/  \______/ |_______/ |__/  |__/ \______/

*/
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./utils/SuAccessControl.sol";

/*
 * @title The contact enables the storage of erc20 tokens under the linear time-vesting with the cliff time-lock.
 * @notice During cliff period all tokens are locked so the user can't claim it.
 * After the cliff period is over token gets gradually unlock every second until the vesting is over.
 *
 * For example, if cliff is 3 months and vesting is 12 months,
 *      during the first 3 mouths user can't claim anything
 *      after 4 months (i.e. 1 month after the cliff) user can claim 1/9 of all tokens
 *      after 6 months user can claim 3/9 of all tokens etc.
 * It's possible to claim tokens by parts during vesting, or claim all at once when vesting if over.
 *
 * To make balance visible in the erc20 wallets, the contact "looks like" erc20 token by implementing its interface
 * however all non-view methods such as transfer or approve aren't active and will be reverted.
*/
contract TimelockVault is SuAccessControl {
    using SafeERC20 for ERC20;
    ERC20 public immutable LOCKED_TOKEN;

    struct Account {
        // we keep all data in one 256 bits slot to safe on gas usage
        uint64 amount_under_vesting_div1e12;
        uint64 amount_already_withdrawn_div1e12;
        uint32 cliff_timestamp;
        uint32 vesting_ends_timestamp;
        // 64 bit amount storage leads to the loss of precision!
        // however erc20 amount with for 18 decimals means that log2(1e18) = ~60 bits are after the comma
        // and 256-60 = 196 bits before the comma. This is way too much for real balances.
        // so if we trunk last 12 digits to keep just 6 digits after the comma = log2(1e6) = ~20 bits
        // we can store all balances up to 2^(64-20) = log10(2^44) =~ 10^13 which is enough for any real amount.
    }

    mapping(address => Account) public accounts;

    // This is the logic of the data reduction, but to save gas we'll use this logic in place.
    // function amount256to64bit(uint256 amount) pure public returns (uint64) {
    //     return uint64(amount / 10e12 );
    // }
    // function amount64to256bit(uint64 amount) pure public returns (uint256) {
    //     return amount * 1e12;
    // }

    constructor(ERC20 _lockedToken) {
        LOCKED_TOKEN = _lockedToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
    * @notice BTotal amount of token was deposited under vesting on behalf of the user.
    */
    function totalDeposited(address user) public view returns (uint256) {
        return uint256(accounts[user].amount_under_vesting_div1e12) * 1e12;
    }

    /**
    * @notice Total amount of token user had claimed.
    */
    function totalClaimed(address user) public view returns (uint256) {
        return uint256(accounts[user].amount_already_withdrawn_div1e12) * 1e12;
    }


    /**
    * @notice Creates an account with time-vesting for the user and withdraws these tokens from msg.sender.
    * @param to_user Beneficiary of the vesting account.
    * @param amount Amount of tokens to be send, which will be deducted from msg.sender.
    * @param vesting_seconds Amount of seconds when linear vesting would be over. Starts from cliff.
    * @param cliff_seconds Amount of seconds while tokens would be completely locked.
    */
    function lockUnderVesting(address to_user, uint256 amount, uint256 vesting_seconds, uint256 cliff_seconds)
    external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // check that vesting doesn't already exit for the user
        require(accounts[to_user].cliff_timestamp == 0, "account's cliff already exit");
        require(accounts[to_user].vesting_ends_timestamp == 0, "account's vesting already exit");
        // create vesting
        require(cliff_seconds < vesting_seconds, "cliff_seconds < vesting_seconds");
        accounts[to_user].cliff_timestamp = uint32(block.timestamp) + uint32(cliff_seconds);
        accounts[to_user].vesting_ends_timestamp = uint32(block.timestamp) + uint32(vesting_seconds);
        addBalance(amount, to_user);
    }

    /**
    * @notice Creates an account with time-vesting for the user and withdraws these tokens from msg.sender.
    *         The method checks if the msg.sender already has a vesting:
    *                               if so - parameters are ignored,
    *                               if not - method creates vesting.
    * @param to_user Beneficiary of the vesting account.
    * @param amount Amount of tokens to be send, which will be deducted from msg.sender.
    * @param vesting_seconds Amount of seconds when linear vesting would be over. Starts from cliff.
    * @param cliff_seconds Amount of seconds while tokens would be completely locked.
    */
    function safeLockUnderVesting(address to_user, uint256 amount, uint256 vesting_seconds, uint256 cliff_seconds)
    external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(cliff_seconds < vesting_seconds, "cliff_seconds < vesting_seconds");
        // check that vesting doesn't already exit for the user, and if no - create one
        if (accounts[to_user].cliff_timestamp == 0) {
            accounts[to_user].cliff_timestamp = uint32(block.timestamp) + uint32(cliff_seconds);
        }
        if (accounts[to_user].vesting_ends_timestamp == 0) {
            accounts[to_user].vesting_ends_timestamp = uint32(block.timestamp) + uint32(vesting_seconds);
        }
        addBalance(amount, to_user);
    }

    /**
    * @notice Adds more tokens to the existing (possibly zero) vesting account. Doesn't change cliff or vesting period!
    * @param amount Amount of token to be send to user under vesting, which will be deducted from msg.sender.
    * @param to_user Beneficiary of the vesting account.
    */
    function addBalance(uint256 amount, address to_user) public {
        // because we store amounts with loss of the precision we need to truck last 12 digits
        LOCKED_TOKEN.safeTransferFrom(msg.sender, address(this), (amount / 1e12) * 1e12);
        accounts[to_user].amount_under_vesting_div1e12 = accounts[to_user].amount_under_vesting_div1e12 + uint64(amount / 1e12);
    }

    /**
     * @notice Checks amount of vested tokens minus already withdrawn.
     * @return Returns amount of tokens the users can withdraw right now.
     */
    function availableToClaim(address user) public view returns (uint256) {
        Account memory account = accounts[user];
        uint256 t = block.timestamp;

        // if the time is before the cliff - there's nothing vested yet
        if (t < account.cliff_timestamp) return 0;

        // if after the cliff
        uint256 vested;
        if (account.vesting_ends_timestamp < t) {
            // if everything is vested
            vested = uint256(account.amount_under_vesting_div1e12) * 1e12;
        } else {
            // otherwise the amount is proportional to the amount after the cliff before end of vesting
            uint256 x = uint256(account.amount_under_vesting_div1e12) * 1e12;
            uint256 y = (t - account.cliff_timestamp);
            uint256 z = (uint256(account.vesting_ends_timestamp) - uint256(account.cliff_timestamp));
            vested = x * y / z;
        }
        // the answer is how much is vested in total minute how much already withdrawn
        return vested - uint256(account.amount_already_withdrawn_div1e12) * 1e12;
    }

    /**
     * @notice User can claim their vested tokens.
     */
    function claim() external {
        uint256 claim_amount = availableToClaim(msg.sender);
        require(claim_amount > 0, "Can't claim 0 tokens");
        accounts[msg.sender].amount_already_withdrawn_div1e12 = accounts[msg.sender].amount_already_withdrawn_div1e12 + uint64(claim_amount / 1e12);
        LOCKED_TOKEN.safeTransfer(msg.sender, (claim_amount / 1e12) * 1e12);
    }


    /**
     * @notice User can donate tokens under vesting to DAO or other admin contract as us treasury.
     */
    function donateTokens(address toAdmin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, toAdmin) == true, "invalid admin address");
        uint256 balance = totalDeposited(msg.sender) - totalClaimed(msg.sender);
        require(balance > 0, "nothing to donate");
        accounts[msg.sender].amount_already_withdrawn_div1e12 = accounts[msg.sender].amount_already_withdrawn_div1e12 + uint64(balance / 1e12);
        LOCKED_TOKEN.safeTransfer(toAdmin, (balance / 1e12) * 1e12);
    }


    /**
    * @notice The owner of the contact can take away tokens accidentally sent to the contract.
    */
    function rescue(ERC20 token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != LOCKED_TOKEN, "No allowed to rescue this token");
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    receive() external payable {}
}
