export default [
  {
    "type": "function",
    "name": "multiSwap",
    "inputs": [
      {
        "name": "_steps",
        "type": "tuple[]",
        "internalType": "struct SwapHelpers.SwapStep[]",
        "components": [
          {
            "name": "poolIdx",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "base",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "quote",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "isBuy",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      },
      {
        "name": "_amount",
        "type": "uint128",
        "internalType": "uint128"
      },
      {
        "name": "_minOut",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "outputs": [
      {
        "name": "out",
        "type": "uint128",
        "internalType": "uint128"
      }
    ],
    "stateMutability": "payable"
  }
]  as const;
