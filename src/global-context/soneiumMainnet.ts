import { createPublicClient, http } from 'viem';

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

const publicClient = createPublicClient({
  chain: soneiumMainnet,
  transport: http(),
});


export default soneiumMainnet;