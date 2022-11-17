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
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./access-control/SuAccessControlAuthenticated.sol";
import "@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol";
import "./vested-escrow/VotesUpgradable.sol";
import "./vested-escrow/VeVoteToken.sol";


//interface IBalanceable {
//
//    /**
//     * @dev Returns the amount of tokens owned by `account`.
//     */
//    function balanceOf(address account) external view returns (uint256);
//
//    /**
//     * @dev Returns the current amount of votes that `account` has.
//     */
//    function getVotes(address account) external view returns (uint256);
//
//    /**
//     * @dev Returns the delegate that `account` has chosen.
//     */
//    function delegates(address account) external view returns (address);
//
//}

/*
 * @title Abstract token that aggregates voting power of all tokens in SuDAO on particular chain
*/
contract VotingPower is SuAccessControlAuthenticated, IERC20, IERC20Metadata, IVotesUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 public MAX_LEN;
    uint256 public MAX_WEIGHT;
    uint256 public TOTAL_VOTING_POWER;

    string private _name;
    string private _symbol;
    EnumerableSet.AddressSet private tokens;
    mapping(address => uint256) public weights;
    uint256 public totalWeight;

    error UnavailableFunctionalityError();
    error WrongArgumentsError();
    error BaseAssumptionError();

    function initialize(
        string memory name_,
        string memory symbol_
    ) initializer public {
        MAX_LEN = 50;
        MAX_WEIGHT = 1e18;
        TOTAL_VOTING_POWER = 42_000_000 * 1e18;
        _name = name_;
        _symbol = symbol_;
    }

    function setTokenWeight(address _token, uint256 _weight) external onlyRole(DAO_ROLE) {
        // TODO: check that token is legit VotesUpgradable instance
        if (_weight > MAX_WEIGHT) revert BaseAssumptionError();

        if (_weight > 0) {
            tokens.add(_token);
            if (tokens.length() > MAX_LEN) revert BaseAssumptionError();

            totalWeight = totalWeight - weights[_token] + _weight;
            weights[_token] = _weight;
        } else {
            tokens.remove(_token);
            totalWeight = totalWeight - weights[_token];
            weights[_token] = 0;
        }
    }

    /**
     * @dev Returns the current amount of votes that `account` has.
     * It uses the voting power of the account.
     * If account has not delegated their own votes, also adds the token balance of the account.
     *
     * For example: we have 2 tokens:
     * NFT (weight 99 * 1e18)
     * suDAO (weight 1 * 1e18) => totalWeight = 100 * 1e18
     * user have 50 suDAO and 1 NFT
     * In total there are 1000 suDAO и 50 NFT.
     *
     * votes1 =
     * (42 * 1e6 * 1e18) * 50 / 1000 * 1e18 / 100*1e18 =
     * (42 * 1e6 * 1e18) * 50 * 1e-5 =
     * 21 000 * 1e18
     *
     * votes2
     * = (42 * 1e6 * 1e18) * 1 / 50 * 99 * 1e18 / 100*1e18
     * = (42 * 1e6 * 1e18) * 1 / 50 * 99 / 100
     * = (42 * 1e6 * 1e18) * 99 / 5 * 1e-3
     * = 831 600 * 1e18
     *
     * In total = 852 600
     */
    function getVotes(address account) public view returns (uint256 votes) {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            votes += TOTAL_VOTING_POWER
            * VotesUpgradeable(token).getVotes(account) / VotesUpgradeable(token).getTotalSupply()
            * weights[token] / totalWeight;
        }
        return votes;
    }

    // =================================implementation of IVotes interfaces =============================
    /**
     * @dev Returns the amount of votes that `account` had at the end of a past block (`blockNumber`).
     */
    // TODO: normalize with getTotalSupply
    function getPastVotes(address account, uint256 blockNumber) external view returns (uint256 votes) {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            votes += TOTAL_VOTING_POWER
            * IVotesUpgradeable(token).getPastVotes(account, blockNumber) / IVotesUpgradeable(token).getPastTotalSupply(blockNumber)
            * weights[token] / totalWeight; // weights in the past could be different?
        }
        return votes;
    }

    /**
     * @dev Returns the total supply of votes available at the end of a past block (`blockNumber`).
     *
     * NOTE: This value is the sum of all available votes, which is not necessarily the sum of all delegated votes.
     * Votes that have not been delegated are still part of total supply, even though they would not participate in a
     * vote.
     */
    function getPastTotalSupply(uint256 blockNumber) external view returns (uint256 supply) {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            supply += IVotesUpgradeable(token).getPastTotalSupply(blockNumber);
        }
        return supply;
    }

    /**
     * @dev Returns the delegate that `account` has chosen.
     */
    function delegates(address account) external view returns (address delegatee) {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            address _delegatee = IVotesUpgradeable(token).delegates(account);
            if (i == 0) {
                delegatee = _delegatee;
            } else {
                if (delegatee != _delegatee) {
                    revert BaseAssumptionError();
                }
            }
        }
        return delegatee;
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     */
    function delegate(address delegatee) external {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            VeVoteToken(token).delegateOnBehalf(msg.sender, delegatee);
        }
    }

    /**
     * @dev Delegates votes from signer to `delegatee`.
     */
    function delegateBySig(
        address delegatee,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        address[] memory tokensArray = tokens.values();
        uint256 l = tokensArray.length;
        for (uint256 i = 0; i < l; i++) {
            address token = tokensArray[i];
            VotesUpgradeable(token).delegateBySig(delegatee, nonce, expiry, v, r, s);
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
        revert UnavailableFunctionalityError();
    }

    /**
    * @dev Mock {IERC20-transfer}
    */
    function transfer(address, uint256) public virtual override returns (bool) {
        revert UnavailableFunctionalityError();
    }

    /**
    * @dev Mock {IERC20-allowance}.
    */
    function allowance(address, address) public view virtual override returns (uint256) {
        revert UnavailableFunctionalityError();
    }

    /**
    * @dev Mock {IERC20-approve}.
    */
    function approve(address, uint256) public virtual override returns (bool) {
        revert UnavailableFunctionalityError();
    }

    /**
    * @dev Mock {IERC20-transferFrom}.
    */
    function transferFrom(address, address, uint256) public virtual override returns (bool) {
        revert UnavailableFunctionalityError();
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
