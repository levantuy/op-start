import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { walletActionsL1 } from 'viem/op-stack'
 
export const walletClientL1 = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum)
}).extend(walletActionsL1());
 
// JSON-RPC Account
export const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' });