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
import "./dependencies/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./dependencies/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./dependencies/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./TimelockVaultVotes.sol";

/*
 * @title Wallet visible storage of erc20 tokens under the linear time-vesting with the cliff time-lock.
 * During cliff period all tokens are locked so the user can't claim it.
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
 *
 * An upgrade over VestingToken to support Voting.
 *
 * dev `turffle compile` would yield some warnings for unused parameters - that okay,
 * because we need to preserve the ERC20 interface without allowing transfer, allows etc.
*/
contract VestingTokenV2 is TimelockVaultVotes, IERC20, IERC20Metadata {
    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_, ERC20 token_)
    TimelockVaultVotes(token_)
    {
        _name = name_;
        _symbol = symbol_;
    }

    /**
    * @dev Returns the name of the token.
    */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return LOCKED_TOKEN.decimals();
    }

    /**
    * @dev See {IERC20-totalSupply}.
    */
    function totalSupply() public view virtual override returns (uint256) {
        return LOCKED_TOKEN.balanceOf(address(this));
    }

    /**
    * @dev See {IERC20-balanceOf}.
    */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return super.totalDeposited(account) - super.totalClaimed(account);
    }

    /**
    * @dev Mock {IERC20-transfer}
    */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer vested token");
    }

    /**
    * @dev Mock {IERC20-allowance}.
    */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        revert("not possible to transfer vested token");
    }

    /**
    * @dev Mock {IERC20-approve}.
    */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer vested token");
    }

    /**
    * @dev Mock {IERC20-transferFrom}.
    */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer vested token");
    }
}
