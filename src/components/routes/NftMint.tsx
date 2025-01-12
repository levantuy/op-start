import styles from "./NftMint.module.css";
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Label,
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
  useReadContracts,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import NFT_ABI from "../../global-context/abi/DemoNFT";
import BERA_ABI from "../../global-context/abi/BeraCrocMultiSwap";
import axios from 'axios';
import { cn } from '../../lib/utils';
import { switchChain } from "viem/actions";

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
  const [quantity, setQuantity] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const { data: totalNFT, isFetched, refetch } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "balanceOf",
    args: [walletAddress as Address],
  });

  const newArray = totalNFT ? (Array(Number(totalNFT)).fill(0) as number[]) : []
  const calls = newArray.map((_, index) => ({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: 'tokenOfOwnerByIndex',
    args: [walletAddress as Address, index],
    chainId,
  }))

  const { data: tokenIDs } = useReadContracts({
    contracts: newArray.length > 0 ? calls as any : [],
  });

  const callsTokenURI = tokenIDs?.map((tokenId) => ({
    abi: NFT_ABI,
    address: nftContractAddress as Address,
    functionName: 'tokenURI',
    args: [tokenId.result as any],
    chainId,
  }));

  const { data: tokenUri } = useReadContracts({
    contracts: tokenIDs ? callsTokenURI : [],
  });

  const fetchTokenURI = async (tokenURI: any) => {
    const metaData = await Promise.all(
      tokenURI.map(async (item: any) => {
        try {
          const { data } = await axios.get(item.result)

          return data
        } catch (error) {
          return ''
        }
      })
    )
    return metaData
  }

  useEffect(() => {
    if (tokenUri) {
      fetchTokenURI(tokenUri as any)
        .then((data) => {
          setMintedNFTs(data as any)
        })
        .catch(console.log)
    }
  }, [tokenUri])

  const { data: bal } = useBalance({
    address: walletAddress,
    chainId,
  });
  const isBalanceZero = bal?.value.toString() === "0";

  const { data: tokenURI } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "tokenURI",
    args: [parseEther("0")],
  });

  useEffect(() => {
    if (isConnected && !didConnect) {
      didConnect = true
      mixpanel.identify(address)
      mixpanel.track('wallet-connect')
    }
  }, [isConnected])

  async function mintWhitelistNft(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    console.log('x1');
    try {
      setIsPending(true);
      setTxDetails("begin...");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.01 * quantity).toString()),
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
    console.log(walletClient, publicClient, walletAddress);
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      setIsPending(true);
      setTxDetails("");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.01 * quantity).toString()),
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

  const handleQuantityChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setQuantity(value);
  };

  function textNftBalances(bal: string): string {
    const balance = Number(bal);
    if (balance > 1) {
      return `You have ${balance} NFTs`;
    } else if (balance === 1) {
      return `You have ${balance} NFT`;
    } else {
      return `You don't own any NFTs yet`;
    }
  }

  return (
    <div className="min-h-screen w-full p-6 font-sans bg-transparent">
      <div className="flex flex-row">
        <div className={"basis-3/4 m-2 border border-gray-300 rounded-lg p-4 bg-transparent"}>
          {/* Minted NFTs List */}
          <h2 className="text-xl font-bold text-left ml-6">Minted NFTs</h2>
          <div className="p-6 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mintedNFTs.map((nft: any) => (
                <div key={nft.tokenId} className="border border-gray-300 rounded-lg p-4">
                  <img
                    src={nft.image}
                    alt={`NFT ${nft.id}`}
                    className="w-full rounded-lg mb-2"
                  />
                  <Label>NFT #{nft.tokenId}</Label>
                  <br />
                  <Label>{nft.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="basis-1/4 m-2 border border-gray-300 rounded-lg p-4 bg-transparent">
          <h2 className="text-xl font-bold text-left mb-6">Mint NFTs</h2>
          {/* Minting Section */}
          <div className="p-6 rounded-lg mb-6">
            <div className="flex items-center space-x-4">
              <Label htmlFor="quantity" className="font-medium">Quantity:</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
              />
              <Button disabled={isPending || !walletAddress || isBalanceZero || !isConnectedToMinato}
                onClick={mintPublicNft}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Mint
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-6">
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
              {walletAddress && isBalanceZero && (
                <div className={styles.rowChecker}>
                  <span className={styles.textError}>
                    You don't have enough ETH balance to mint NFT
                  </span>
                  <a
                    href={"/"}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.txLink}
                  >
                    Bridge
                  </a>
                </div>
              )}

              {!isConnectedToMinato && walletAddress && (
                <div className={styles.rowChecker}>
                  <span className={styles.textError}>
                    Please connect to Soneium Minato
                  </span>

                  <button
                    className={styles.buttonSwitchChain}
                    onClick={() => switchChain({ chainId })}
                  >
                    Switch to Soneium Minato
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <Label>Total Minted: <span className="font-bold">{walletAddress && (
                <span>{textNftBalances(totalNFT?.toString() || "0")}</span>
              )}</span></Label>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaHGo7pQ9x7B1rNvPbkzTnrZNuHA4mx53t8ZnAA8JFUG2/0.gif"
                alt='Image preview'
                className="w-full rounded-lg mb-2"
              />
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <Label>Description: </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
