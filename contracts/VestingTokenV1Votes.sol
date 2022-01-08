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

/*
 * @title Wallet visible storage of voting tokens for the underlying erc20 token with a low holder count.
 *
 * @dev This contract tracks voting units, which are a measure of voting power that can be transferred, and provides
 * a system of vote delegation. The contract stores the complete list of delegators for each active delegatee,
 * so an arbitrarily large number of delegators will NOT be able to delegate their votes to a given delegatee.
 *
 * To make balance visible in the erc20 wallets, the contact "looks like" erc20 token by implementing its interface
 * however all non-view methods such as transfer or approve aren't active and will be reverted.
 *
 * dev `turffle compile` would yield some warnings for unused parameters - that okay,
 * because we need to preserve the ERC20 interface without allowing transfer, allows etc.
*/
contract VestingTokenV1Votes is IERC20, IERC20Metadata {

    ERC20 public immutable veSuDAO;

    mapping(address => address[]) private _delegatorsOf;
    mapping(address => address) private _delegation;

    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    constructor(ERC20 _veSuDAO) {
        veSuDAO = _veSuDAO;
    }

    /**
    * @dev Returns the name of the token.
    */
    function name() public view virtual override returns (string memory) {
        return "Vested SU DAO V1 Votes";
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return "veSuDAOV1Votes";
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
        return veSuDAO.decimals();
    }

    /**
    * @dev See {IERC20-totalSupply}.
    */
    function totalSupply() public view virtual override returns (uint256) {
        return veSuDAO.totalSupply();
    }

    /**
    * @dev See {IERC20-balanceOf}.
    */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return veSuDAO.balanceOf(account);
    }

    /**
     * @dev Returns the current amount of votes that `account` has.
     */
    function getVotes(address account) external view returns (uint256 votes) {
        address[] memory delegators = _delegatorsOf[account];
        uint256 length = delegators.length;
        for (uint256 i = 0; i < length; i++) {
            votes += balanceOf(delegators[i]);
        }
    }

    /**
     * @dev Returns the delegate that `account` has chosen.
     */
    function delegates(address account) public view returns (address) {
        return _delegation[account];
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     */
    function delegate(address delegatee) external {
        _delegate(msg.sender, delegatee);
    }

    /**
    * @dev Mock {IERC20-transfer}
    */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        revert("cannot transfer voting token");
    }

    /**
    * @dev Mock {IERC20-allowance}.
    */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        revert("cannot transfer voting token");
    }

    /**
    * @dev Mock {IERC20-approve}.
    */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        revert("cannot transfer voting token");
    }

    /**
    * @dev Mock {IERC20-transferFrom}.
    */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        revert("cannot transfer voting token");
    }

    /**
     * @dev Delegate all of `account`'s voting units to `delegatee`.
     *
     * Emits events {DelegateChanged} and {DelegateVotesChanged}.
     */
    function _delegate(address account, address delegatee) internal virtual {
        address oldDelegate = delegates(account);
        
        require(delegatee != address(0), "Delegate to the zero address");
        require(delegatee != oldDelegate, "Delegate to current delegatee");

        uint256 length = _delegatorsOf[oldDelegate].length;
        for (uint256 i = 0; i < length; i++) {
            if (_delegatorsOf[oldDelegate][i] == account) {
                _delegatorsOf[oldDelegate][i] = _delegatorsOf[oldDelegate][length - 1];                
                _delegatorsOf[oldDelegate].pop();
                break;
            }
        }

        _delegation[account] = delegatee;
        _delegatorsOf[delegatee].push(account);

        emit DelegateChanged(account, oldDelegate, delegatee);
    }
}
