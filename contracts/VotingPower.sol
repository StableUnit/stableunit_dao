pragma solidity ^0.8.0;

contract VotingPower is Erc20Votes {

    function mint() extrenal onlyRoles(VESTED_CONTRACT) {

    }

    function burn() extrenal onlyRoles(VESTED_CONTRACT) {

    }
}
