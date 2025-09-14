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

const optimism = {
  id: 10,
  name: 'Optimism Mainnet',
  network: 'optimism',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.optimism.io/'],
    },
    public: {
      http: ['https://mainnet.optimism.io/'],
    },
  },
  blockExplorers: {
    default: { name: 'Optimism Explorer', url: 'https://explorer.optimism.io' },
  },
};

const linea = {
  id: 10,
  name: 'Linea Mainnet',
  network: 'linea',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://linea-mainnet.infura.io/'],
    },
    public: {
      http: ['https://linea-mainnet.infura.io/'],
    },
  },
  blockExplorers: {
    default: { name: 'Linea Explorer', url: 'https://lineascan.build' },
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

export { soneiumMainnet, Monad, optimism, linea };