import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import { Monad as monadTestnet } from '../../global-context/soneiumMainnet.ts';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient
} from "wagmi";
import contractABI from "../../global-context/abi/Marketplace.ts";
import { Button, Input } from '../base/index.tsx';

export const Marketplace = () => {
  const [nftAddress, setNftAddress] = useState<Address>('0xaa1059a2475b547F6A6A3612e2889281a5a496f8');
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [marketplaceContract] = useState<Address>('0xB99B1df1F52E9E304C155ed0514C8329F03774C9');
  const chainId = monadTestnet.id;
  const { address: walletAddress } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  // Fetch all NFTs owned by the user
  const { data: nftList, refetch } = useReadContract({
    account: walletAddress,
    address: marketplaceContract,
    abi: contractABI,
    functionName: "getAllNFTsAccount",
    args: [nftAddress, walletAddress as any]
  });

  useEffect(() => {
    if (nftList) {
      const newArray = nftList ? nftList.map(id => Number(id)) : []
      setNfts(newArray as any);
    }
  }, [nftList]);

  async function listNFT(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    setIsPending(true);

    try {
      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "isNFTApproved",
        args: selectedNFT ? [nftAddress, selectedNFT] : undefined,
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      }).then(item => {
        console.log(item);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }

    try {
      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "listNFT",
        args: selectedNFT ? [nftAddress, selectedNFT, parseEther(price)] : undefined,
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full">
      <h1>NFT Marketplace</h1>
      <Input
        id="quantity"
        type="text"
        value={nftAddress}
        onChange={(e) => setNftAddress(e.target.value as any)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        min="1"
      />
      <Button disabled={isPending || !walletAddress}
        onClick={() => refetch()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Get My Nft of Contract
      </Button>

      <div>
        <h2>My NFTs</h2>
        <ul>
          {nfts.map((tokenId) => (
            <li key={tokenId} onClick={() => setSelectedNFT(tokenId)}>
              NFT #{tokenId}
            </li>
          ))}
        </ul>
      </div>

      {selectedNFT !== null && (
        <div>
          <h2>List NFT #{selectedNFT}</h2>
          <input
            type="text"
            placeholder="Enter price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button onClick={listNFT}>List NFT</button>
        </div>
      )}
    </div>
  );
};

