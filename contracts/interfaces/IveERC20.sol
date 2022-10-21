// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IveERC20 is IERC20 {
    /**
* @notice Creates an account with time-vesting for the user and withdraws these tokens from msg.sender.
    * @param account Beneficiary of the vesting account.
    * @param amount Amount of tokens to be send, which will be deducted from msg.sender.
    * @param vestingSeconds Amount of seconds when linear vesting would be over. Starts from cliff.
    * @param cliffSeconds Amount of seconds while tokens would be completely locked.
    * @param tgeUnlockRatio1e18 ratio/1e18 ⊂ [0..1] that indicates how many tokens are going to be unlocked during TGE
    * @param vestingFrequencySeconds how frequently token are going to be unlocked after the cliff.
    */
    function lockUnderVesting(
        address account,
        uint256 amount,
        uint256 vestingSeconds,
        uint256 cliffSeconds,
        uint256 tgeUnlockRatio1e18,
        uint256 vestingFrequencySeconds
    ) external;
}
