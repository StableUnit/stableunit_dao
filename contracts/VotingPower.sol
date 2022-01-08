// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
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
import "./utils/SuAccessControl.sol";

/*
 * @title Abstract token that aggregates voting power of all tokens in SuDAO on particular chain
*/

interface IBalanceable {

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Returns the current amount of votes that `account` has.
     */
    function getVotes(address account) external view returns (uint256);

    /**
     * @dev Returns the delegate that `account` has chosen.
     */
    function delegates(address account) external view returns (address);

}

contract VotingPower is IERC20, IERC20Metadata, SuAccessControl {

    uint256 MAX_LEN = 50;
    uint256 MAX_WEIGHT = 10000;

    IBalanceable[] public tokens;
    uint256[] public multipliers;

    mapping(address => bool) private _tokens;

    string private _name;
    string private _symbol;

    constructor(
        string memory name_,
        string memory symbol_
    ) {
        _name = name_;
        _symbol = symbol_;
    }

    function addToken(IBalanceable token, uint256 multiplier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokens.length < MAX_LEN, "too many tokens");
        require(!_tokens[address(token)], "already added");

        _tokens[address(token)] = true;
        tokens.push(token);
        multipliers.push(multiplier);
    }

    function deleteToken(uint256 id, IBalanceable token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 lastId = tokens.length - 1;
        require(tokens[id] == token, "wrong token id");

        tokens[id] = tokens[lastId];
        multipliers[id] = multipliers[lastId];

        _tokens[address(token)] = false;
        tokens.pop();
        multipliers.pop();
    }

    function setWeight(uint256 id, IBalanceable token, uint256 newMultiplier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokens[id] == token, "wrong token id");
        require(newMultiplier <= MAX_WEIGHT, "weight too high");
        multipliers[id] = newMultiplier;
    }

    /**
     * @dev Returns the current amount of votes that `account` has.
     * If account has not delegated their votes, it uses the token balance of the account.
     * Otherwise, it uses the voting power of the account.
     */
    function getVotes(address account) public view returns (uint256 votes) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if(tokens[i].delegates(account) == address(0)) {
                votes += tokens[i].balanceOf(account) * multipliers[i];
            }
            else {
                votes += tokens[i].getVotes(account) * multipliers[i];
            }
        }
    }

    // ==================== standard erc20 interface ==============================
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
        return 18;
    }

    /**
    * @dev See {IERC20-balanceOf}.
    */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return getVotes(account);
    }

    /**
    * @dev See {IERC20-totalSupply}.
    */
    function totalSupply() public view virtual override returns (uint256) {
        revert("not implemented");
    }

    /**
    * @dev Mock {IERC20-transfer}
    */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer this token");
    }

    /**
    * @dev Mock {IERC20-allowance}.
    */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        revert("not possible to transfer this token");
    }

    /**
    * @dev Mock {IERC20-approve}.
    */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer this token");
    }

    /**
    * @dev Mock {IERC20-transferFrom}.
    */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer this token");
    }
}
