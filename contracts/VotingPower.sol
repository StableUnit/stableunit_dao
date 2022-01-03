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
}

contract VotingPower is IERC20, IERC20Metadata, SuAccessControl {
    uint256 MAX_LEN = 50;
    IBalanceable[] public tokens;
    // TODO: set weight
    // TODO: set weights limits
    uint256[] public multipliers;

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
        tokens.push(token);
        multipliers.push(multiplier);
        require(tokens.length <= MAX_LEN, "too many tokens");
    }

    function deleteToken(uint256 id, IBalanceable token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokens[id] == token, "wrong token id");
        uint256 len = tokens.length;
        // if id is not the last token
        if (2 <= len && id < len-1) {
            // copy the last on of the place of id
            tokens[id] = tokens[len-1];
            multipliers[id] = multipliers[len-1];
        }
        tokens.pop();
        multipliers.pop();
    }

    // TODO: rename to setWeight
    function editToken(uint256 id, IBalanceable token, uint256 newMultiplier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokens[id] == token, "wrong token id");
        multipliers[id] = newMultiplier;
    }

    /**
    * @dev See {IERC20-balanceOf}.
    */
    // TODO: gas estimate
    // TODO: think to rename it to keep compatible with ERC20Votes (or compound) interface of voting power
    function balanceOf(address account) public view virtual override returns (uint256) {
        uint256 balance = 0;
        for (uint256 i = 0; i < tokens.length; i++) {
            // balance = balance + (tokens[i].balanceOf(account) + tokens[i].votingPower()) * multipliers[i];
            balance = balance + tokens[i].balanceOf(account) * multipliers[i];
        }
        return balance;
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
        revert("not possible to transfer voting token");
    }

    /**
    * @dev Mock {IERC20-transferFrom}.
    */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        revert("not possible to transfer vested token");
    }

}
