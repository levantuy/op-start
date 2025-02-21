const soneiumMainnet = {
  id: 1868,
  name: 'Soneium Mainnet',
  network: 'soneium',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soneium.org/'],
    },
    public: {
      http: ['https://rpc.soneium.org/'],
    },
  },
  blockExplorers: {
    default: { name: 'Soneium Explorer', url: 'https://soneium.blockscout.com' },
  },
};

const Monad = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
};

export { soneiumMainnet, Monad };