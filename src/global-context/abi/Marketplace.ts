export default [
  {
      "inputs": [{"internalType": "address","name": "_feeRecipient","type": "address"}],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {"indexed": true,"internalType": "address","name": "seller","type": "address"},
          {"indexed": true,"internalType": "address","name": "nft","type": "address"},
          {"indexed": false,"internalType": "uint256","name": "tokenId","type": "uint256"},
          {"indexed": false,"internalType": "uint256","name": "price","type": "uint256"}
      ],
      "name": "NFTListed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {"indexed": true,"internalType": "address","name": "bidder","type": "address"},
          {"indexed": true,"internalType": "address","name": "nft","type": "address"},
          {"indexed": false,"internalType": "uint256","name": "tokenId","type": "uint256"},
          {"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
      ],
      "name": "NFTBid",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {"indexed": true,"internalType": "address","name": "buyer","type": "address"},
          {"indexed": true,"internalType": "address","name": "nft","type": "address"},
          {"indexed": false,"internalType": "uint256","name": "tokenId","type": "uint256"},
          {"indexed": false,"internalType": "uint256","name": "price","type": "uint256"}
      ],
      "name": "NFTSold",
      "type": "event"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "royalty","type": "uint256"}
      ],
      "name": "setRoyalty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "tokenId","type": "uint256"},
          {"internalType": "uint256","name": "price","type": "uint256"}
      ],
      "name": "listNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "tokenId","type": "uint256"}
      ],
      "name": "bidNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "tokenId","type": "uint256"}
      ],
      "name": "buyNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "tokenId","type": "uint256"}
      ],
      "name": "sellNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {"internalType": "address","name": "nft","type": "address"},
          {"internalType": "uint256","name": "tokenId","type": "uint256"}
      ],
      "name": "getAllNFTs",
      "outputs": [
          {
              "components": [
                  {"internalType": "address","name": "seller","type": "address"},
                  {"internalType": "uint256","name": "price","type": "uint256"},
                  {"internalType": "bool","name": "active","type": "bool"}
              ],
              "internalType": "struct NFTMarketplace.Listing",
              "name": "listing",
              "type": "tuple"
          },
          {
              "components": [
                  {"internalType": "address","name": "highestBidder","type": "address"},
                  {"internalType": "uint256","name": "highestBid","type": "uint256"},
                  {"internalType": "bool","name": "active","type": "bool"}
              ],
              "internalType": "struct NFTMarketplace.Auction",
              "name": "auction",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "nft","type": "address"}],
    "name": "getAllNFTsAccount",
    "outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;