import { createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia, optimismSepolia } from 'viem/chains';
import { walletActionsL1, publicActionsL1, walletActionsL2, publicActionsL2  } from 'viem/op-stack';

// JSON-RPC Account
export const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' });

export const walletClientL1 = createWalletClient({
  account,
  chain: sepolia,
  transport: custom(window.ethereum, {retryCount: 10})
}).extend(walletActionsL1());

export const publicClientL1 = createPublicClient({
  chain: sepolia,
  transport: custom(window.ethereum, {retryCount: 10})
}).extend(publicActionsL1());
 
export const walletClientL2 = createWalletClient({
  account,
  chain: optimismSepolia,
  transport: custom(window.ethereum, {retryCount: 10})
}).extend(walletActionsL2());

export const publicClientL2 = createPublicClient({
  chain: optimismSepolia,
  transport: custom(window.ethereum, {retryCount: 10})
}).extend(publicActionsL2());