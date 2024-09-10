export const daoPassportNftAbi = [
    {
        inputs: [],
        name: "AlreadyMinted",
        type: "error",
    },
    {
        inputs: [],
        name: "BadAccessControlSingleton",
        type: "error",
    },
    {
        inputs: [],
        name: "FutureSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSignatureLength",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppDestinationChainIsNotTrusted",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppGasLimitIsTooLow",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppInvalidAdapterParams",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppInvalidEndpointCaller",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppInvalidMinGas",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppInvalidSourceSendingContract",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppMinGasLimitNotSet",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppNoTrustedPathRecord",
        type: "error",
    },
    {
        inputs: [],
        name: "LzAppPayloadTooLarge",
        type: "error",
    },
    {
        inputs: [],
        name: "MaxMintLimit",
        type: "error",
    },
    {
        inputs: [],
        name: "NonPositiveDstChainIdToBatchLimit",
        type: "error",
    },
    {
        inputs: [],
        name: "NonPositiveDstChainIdToTransferGas",
        type: "error",
    },
    {
        inputs: [],
        name: "NonPositiveMinGasToTransferAndStore",
        type: "error",
    },
    {
        inputs: [],
        name: "NonblockingLzAppCallerMustBeLzApp",
        type: "error",
    },
    {
        inputs: [],
        name: "NonblockingLzAppInvalidPayload",
        type: "error",
    },
    {
        inputs: [],
        name: "NonblockingLzAppNoStoredMessage",
        type: "error",
    },
    {
        inputs: [],
        name: "ONFTBatchSizeLimit",
        type: "error",
    },
    {
        inputs: [],
        name: "ONFTNoCreditsStored",
        type: "error",
    },
    {
        inputs: [],
        name: "ONFTNotEnoughGas",
        type: "error",
    },
    {
        inputs: [],
        name: "ONFTNotOwnerOrApproved",
        type: "error",
    },
    {
        inputs: [],
        name: "ONFTSendFromIncorrectOwner",
        type: "error",
    },
    {
        inputs: [],
        name: "OldSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyAdminError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyAlerterError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyDAOError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyLiquidationAccessError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyMintAccessError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyRewardAccessError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyRoleError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyVaultAccessError",
        type: "error",
    },
    {
        inputs: [],
        name: "TokenIdsIsEmpty",
        type: "error",
    },
    {
        inputs: [],
        name: "UnavailableFunctionalityError",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "approved",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "_hashedPayload",
                type: "bytes32",
            },
        ],
        name: "CreditCleared",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "_hashedPayload",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
        ],
        name: "CreditStored",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "fromDelegate",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toDelegate",
                type: "address",
            },
        ],
        name: "DelegateChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegate",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "previousBalance",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newBalance",
                type: "uint256",
            },
        ],
        name: "DelegateVotesChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [],
        name: "EIP712DomainChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "_nonce",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_reason",
                type: "bytes",
            },
        ],
        name: "MessageFailed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                indexed: true,
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_toAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "_tokenIds",
                type: "uint256[]",
            },
        ],
        name: "ReceiveFromChain",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "_nonce",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "_payloadHash",
                type: "bytes32",
            },
        ],
        name: "RetryMessageSuccess",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "bytes",
                name: "_toAddress",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "_tokenIds",
                type: "uint256[]",
            },
        ],
        name: "SendToChain",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "uint16",
                name: "_type",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_minDstGas",
                type: "uint256",
            },
        ],
        name: "SetMinDstGas",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "precrime",
                type: "address",
            },
        ],
        name: "SetPrecrime",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint16",
                name: "_remoteChainId",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_path",
                type: "bytes",
            },
        ],
        name: "SetTrustedRemote",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint16",
                name: "_remoteChainId",
                type: "uint16",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "_remoteAddress",
                type: "bytes",
            },
        ],
        name: "SetTrustedRemoteAddress",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "ACCESS_CONTROL_SINGLETON",
        outputs: [
            {
                internalType: "contract ISuAccessControl",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ADMIN_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ALERTER_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "CLOCK_MODE",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DAO_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DEFAULT_PAYLOAD_SIZE_LIMIT",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "FUNCTION_TYPE_SEND",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "LIQUIDATION_ACCESS_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MINT_ACCESS_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "REWARD_ACCESS_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "SYSTEM_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "VAULT_ACCESS_ROLE",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newBackendSigner",
                type: "address",
            },
        ],
        name: "changeBackendSigner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
        ],
        name: "clearCredits",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "clock",
        outputs: [
            {
                internalType: "uint48",
                name: "",
                type: "uint48",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "delegatee",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "delegateBySig",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                internalType: "address",
                name: "delegatee",
                type: "address",
            },
        ],
        name: "delegateOnBehalf",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "delegates",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        name: "dstChainIdToBatchLimit",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        name: "dstChainIdToTransferGas",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "eip712Domain",
        outputs: [
            {
                internalType: "bytes1",
                name: "fields",
                type: "bytes1",
            },
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "version",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "verifyingContract",
                type: "address",
            },
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
            {
                internalType: "uint256[]",
                name: "extensions",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_toAddress",
                type: "bytes",
            },
            {
                internalType: "uint256[]",
                name: "_tokenIds",
                type: "uint256[]",
            },
            {
                internalType: "bool",
                name: "_useZro",
                type: "bool",
            },
            {
                internalType: "bytes",
                name: "_adapterParams",
                type: "bytes",
            },
        ],
        name: "estimateSendBatchFee",
        outputs: [
            {
                internalType: "uint256",
                name: "nativeFee",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "zroFee",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_toAddress",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "_useZro",
                type: "bool",
            },
            {
                internalType: "bytes",
                name: "_adapterParams",
                type: "bytes",
            },
        ],
        name: "estimateSendFee",
        outputs: [
            {
                internalType: "uint256",
                name: "nativeFee",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "zroFee",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        name: "failedMessages",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
        ],
        name: "forceResumeReceive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getApproved",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_version",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "_chainId",
                type: "uint16",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_configType",
                type: "uint256",
            },
        ],
        name: "getConfig",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "timepoint",
                type: "uint256",
            },
        ],
        name: "getPastTotalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "timepoint",
                type: "uint256",
            },
        ],
        name: "getPastVotes",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_remoteChainId",
                type: "uint16",
            },
        ],
        name: "getTrustedRemoteAddress",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "getVotes",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "hasMinted",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_accessControlSingleton",
                type: "address",
            },
            {
                internalType: "address",
                name: "_layerZeroEndpoint",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_chainNumber",
                type: "uint256",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
        ],
        name: "isApprovedForAll",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
        ],
        name: "isTrustedRemote",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "lzEndpoint",
        outputs: [
            {
                internalType: "contract ILayerZeroEndpointUpgradeable",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "_nonce",
                type: "uint64",
            },
            {
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
        ],
        name: "lzReceive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        name: "minDstGasLookup",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "minGasToTransferAndStore",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextMintId",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "_nonce",
                type: "uint64",
            },
            {
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
        ],
        name: "nonblockingLzReceive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "nonces",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "ownerOf",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        name: "payloadSizeLimitLookup",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "precrime",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_srcAddress",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "_nonce",
                type: "uint64",
            },
            {
                internalType: "bytes",
                name: "_payload",
                type: "bytes",
            },
        ],
        name: "retryMessage",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_toAddress",
                type: "bytes",
            },
            {
                internalType: "uint256[]",
                name: "_tokenIds",
                type: "uint256[]",
            },
            {
                internalType: "address payable",
                name: "_refundAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_zroPaymentAddress",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "_adapterParams",
                type: "bytes",
            },
        ],
        name: "sendBatchFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_toAddress",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "_refundAddress",
                type: "address",
            },
            {
                internalType: "address",
                name: "_zroPaymentAddress",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "_adapterParams",
                type: "bytes",
            },
        ],
        name: "sendFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uri",
                type: "string",
            },
        ],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_version",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "_chainId",
                type: "uint16",
            },
            {
                internalType: "uint256",
                name: "_configType",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_config",
                type: "bytes",
            },
        ],
        name: "setConfig",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "uint256",
                name: "_dstChainIdToBatchLimit",
                type: "uint256",
            },
        ],
        name: "setDstChainIdToBatchLimit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "uint256",
                name: "_dstChainIdToTransferGas",
                type: "uint256",
            },
        ],
        name: "setDstChainIdToTransferGas",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "_packetType",
                type: "uint16",
            },
            {
                internalType: "uint256",
                name: "_minGas",
                type: "uint256",
            },
        ],
        name: "setMinDstGas",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_minGasToTransferAndStore",
                type: "uint256",
            },
        ],
        name: "setMinGasToTransferAndStore",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_dstChainId",
                type: "uint16",
            },
            {
                internalType: "uint256",
                name: "_size",
                type: "uint256",
            },
        ],
        name: "setPayloadSizeLimit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_precrime",
                type: "address",
            },
        ],
        name: "setPrecrime",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_version",
                type: "uint16",
            },
        ],
        name: "setReceiveVersion",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_version",
                type: "uint16",
            },
        ],
        name: "setSendVersion",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_srcChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_path",
                type: "bytes",
            },
        ],
        name: "setTrustedRemote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "_remoteChainId",
                type: "uint16",
            },
            {
                internalType: "bytes",
                name: "_remoteAddress",
                type: "bytes",
            },
        ],
        name: "setTrustedRemoteAddress",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "storedCredits",
        outputs: [
            {
                internalType: "uint16",
                name: "srcChainId",
                type: "uint16",
            },
            {
                internalType: "address",
                name: "toAddress",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "creditsRemain",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "tokenURI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        name: "trustedRemoteLookup",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
