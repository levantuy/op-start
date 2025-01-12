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
  useReadContracts,
  useWalletClient,
} from "wagmi";
import NFT_ABI from "../../global-context/abi/DemoNFT";
import BERA_ABI from "../../global-context/abi/BeraCrocMultiSwap";
// import axios from 'axios'

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
    functionName: 'tokenOfOwnerByIndex',
    args: [walletAddress, index],
    chainId,
  }))

  const { data: tokenIDs } = useReadContracts({
    contracts: newArray.length > 0 ? calls : [],
  });

  const callsTokenURI = tokenIDs?.map((tokenId) => ({
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
    chainId,
  }));

  const { data: tokenUri } = useReadContracts({
    contracts: tokenIDs ? callsTokenURI : [],
  });

  // const fetchTokenURI = async (tokenURI: string[]) => {
  //   const metaData = await Promise.all(
  //     tokenURI.map(async (item) => {
  //       try {
  //         const { data } = await axios.get(item)

  //         return data
  //       } catch (error) {
  //         return ''
  //       }
  //     })
  //   )
  //   return metaData
  // }

  // useEffect(() => {
  //   if (tokenUri) {
  //     fetchTokenURI(tokenUri as any)
  //       .then((data) => {
  //         setMintedNFTs(data as any)
  //       })
  //       .catch(console.log)
  //   }
  // }, [tokenUri])

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

  useEffect(() => {    
    console.log(totalNFT);
    console.log(newArray);
    console.log(calls);
    console.log(tokenIDs);
  }, [totalNFT])

  // useEffect(() => {
  //   if (data && isFetched) {
  //     for (let i = 0; i < Number(data); i++) {
  //       const { data: tokenId } = useReadContract({
  //         abi: NFT_ABI,
  //         address: nftContractAddress,
  //         functionName: "tokenOfOwnerByIndex",
  //         args: [walletAddress as Address, i as any],
  //       });

  //       console.log(tokenId);
  //     }
  //   }
  // }, []);

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

  async function beraSwap(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    alert('xxx 1');
    try {
      setIsPending(true);
      setTxDetails("");
      // Define the parameters
      const steps = [
        {
          poolIdx: 36000, // Example pool index
          base: "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03" as Address, // Replace with actual base token address
          quote: "0x0000000000000000000000000000000000000000" as Address, // Replace with actual quote token address
          isBuy: false // Example boolean
        }];

      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: BERA_ABI,
        value: parseEther((0.001 * 1).toString()),
        functionName: "multiSwap",
        args: [steps as any, parseEther("0.001"), parseEther("0.007140140520516135")],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://bartio.beratrail.io/tx/${hash}`);
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
    alert('xxx n');
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
    <div className="min-h-screen w-full bg-gray-100 p-6 font-sans">
      <div className="flex flex-row">
        <div className="basis-3/4 m-2">
          {/* Minted NFTs List */}
          <h2 className="text-xl font-bold text-left mb-6">Minted NFTs</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mintedNFTs.map((nft) => (<></>
                // <div key={nft.id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                //   <img
                //     src={nft.imageUrl}
                //     alt={`NFT ${nft.id}`}
                //     className="w-full rounded-lg mb-2"
                //   />
                //   <p className="text-center text-gray-700 font-medium">NFT #{nft.id}</p>
                // </div>
              ))}
            </div>
          </div>
        </div>
        <div className="basis-1/4 m-2">
          <h2 className="text-xl font-bold text-left mb-6">Mint NFTs</h2>
          {/* Minting Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
              />
              <button
                onClick={mintPublicNft}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Mint
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <p className="text-gray-700">Total Minted: <span className="font-bold">{walletAddress && (
                <span>{textNftBalances(totalNFT?.toString() || "0")}</span>
              )}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
