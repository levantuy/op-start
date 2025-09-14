import {
  defineMainnetChainPair,
  defineSepoliaChainPair,
} from '../chain-pairs/chainPairs'
import { fraxtalSepolia } from '../chain-pairs/chains/fraxtalSepolia'
import {
  base,
  baseSepolia,
  fraxtal,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia,
  berachainTestnetbArtio, 
  linea
} from 'viem/chains';
import { soneiumMainnet, Monad } from '../global-context/contextChain';

export const baseChainPair = defineMainnetChainPair(base)
export const lineaChainPair = defineMainnetChainPair(linea)
export const fraxtalChainPair = defineMainnetChainPair(fraxtal)
export const optimismChainPair = defineMainnetChainPair(optimism)
export const zoraChainPair = defineMainnetChainPair(zora)

export const baseSepoliaChainPair = defineSepoliaChainPair(baseSepolia)
export const fraxtalSepoliaChainPair = defineSepoliaChainPair(fraxtalSepolia)
export const optimismSepoliaChainPair = defineSepoliaChainPair(optimismSepolia)
export const zoraSepoliaChainPair = defineSepoliaChainPair(zoraSepolia)
export const beraChainPair = defineSepoliaChainPair(berachainTestnetbArtio)

const minato = {
  ...soneiumMainnet,
  name: "Soneium Mainnet",
  iconUrl: "/symbol-full-color.svg",
};
export const minatoChainPair = defineSepoliaChainPair(minato)

const monad = {
  ...Monad,
  name: "Monad Testnet",
  iconUrl: "/symbol-full-color.svg",
};
export const monadChainPair = defineSepoliaChainPair(monad)

export const supportedMainnetChainPairs = [
  optimismChainPair,
  baseChainPair,
  lineaChainPair,
] as const

export const supportedSepoliaChainPairs = [
  monadChainPair,
  // baseSepoliaChainPair,
  // fraxtalSepoliaChainPair,
  // optimismSepoliaChainPair,
  // zoraSepoliaChainPair,
  // minatoChainPair,  
  // beraChainPair,
] as const

export const supportedChainPairs = [
  ...supportedMainnetChainPairs,
  ...supportedSepoliaChainPairs,
] as const

export const chainsToConfigure = [    
  ...supportedChainPairs.map(({ l2Chain }) => l2Chain),
  sepolia,
  mainnet,
] as const

export type ChainToConfigure = (typeof chainsToConfigure)[number]
export type ChainIdsToConfigure = ChainToConfigure['id']

export type SupportedChainPair = (typeof supportedChainPairs)[number]
export type SupportedL2Chain = SupportedChainPair['l2Chain']
export type SupportedL2ChainId = SupportedL2Chain['id']

export const supportedChainPairByL2ChainId = supportedChainPairs.reduce<
  Record<number, SupportedChainPair>
>((acc, chainPair) => {
  acc[chainPair.l2Chain.id] = chainPair
  return acc
}, {})
