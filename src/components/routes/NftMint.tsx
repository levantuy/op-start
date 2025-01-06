import styles from "./NftMint.module.css";
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
} from '../base';
import { useMixpanel } from '../../global-context/mixpanelContext';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Address, parseEther } from 'viem';
import { soneiumMinato } from 'wagmi/chains';
import {
  useAccount,
  useBalance,
  useChainId,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import NFT_ABI from "../../global-context/abi/DemoNFT";
import { Separator } from '../base';

export const NftMint = () => {
  const navigate = useNavigate();

  const { isConnected, address } = useAccount();
  const mixpanel = useMixpanel();
  let didConnect = false;
  const [txDetails, setTxDetails] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const chainId = soneiumMinato.id;
  const { address: walletAddress } = useAccount();
  const nftContractAddress = "0xc5c89f294370Be04970B442c872d06e01f78e9b5";
  const connectedId = useChainId();
  const isConnectedToMinato = connectedId === soneiumMinato.id;

  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const { data, isFetched, refetch } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "balanceOf",
    args: [walletAddress as Address],
  });

  const { data: bal } = useBalance({
    address: walletAddress,
    chainId,
  });
  const isBalanceZero = bal?.value.toString() === "0";

  useEffect(() => {
    if (isConnected && !didConnect) {
      didConnect = true
      mixpanel.identify(address)
      mixpanel.track('wallet-connect')
    }
  }, [isConnected])

  async function mintWhitelistNft(): Promise<void> {
    console.log('x:', publicClient, chainId);
    if (!walletClient || !publicClient || !walletAddress) return;
    console.log('x1');
    try {
      setIsPending(true);
      setTxDetails("begin...");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.01 * 1).toString()),
        functionName: "whitelistMint",
        args: [1 as any],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://explorer-testnet.soneium.org/tx/${hash}`);
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  async function mintPublicNft(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      setIsPending(true);
      setTxDetails("");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.01 * 1).toString()),
        functionName: "publicMint",
        args: [1 as any],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://explorer-testnet.soneium.org/tx/${hash}`);
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-[500px]">
      <Card className="p-0 pt-3 space-y-2">
        <CardContent>
          <h1>Mint Nft</h1>
          <Button
            disabled={
              isPending || !walletAddress || isBalanceZero || !isConnectedToMinato
            }
            onClick={mintWhitelistNft}
            type="button"
          >
            {isPending ? "Confirming..." : "Mint whitelist NFT"}
          </Button>
          <Separator />
          <Button
            disabled={
              isPending || !walletAddress || isBalanceZero || !isConnectedToMinato
            }
            onClick={mintPublicNft}
            type="button"
          >
            {isPending ? "Confirming..." : "Mint public NFT"}
          </Button>
          {txDetails && (
            <div className={styles.txDetails}>
              <span>🎉 Congrats! Your NFT has been minted 🐣 </span>
              <a
                href={txDetails}
                target="_blank"
                rel="noreferrer"
                className={styles.txLink}
              >
                View transaction
              </a>
            </div>
          )}
          {!isConnected && (<ConnectButton />)}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="secondary" onClick={() => navigate('/')}>Back to home</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
