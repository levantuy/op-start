import styles from "./NftMint.module.css";
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
  const [nftAddress, setNftAddress] = useState<Address>('0xe1a42c333ad20845546e402f5f4256cf2b8b62ab');
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [marketplaceContract] = useState<Address>('0xFE2Ea8634f304d3eb4f7283eC63C623a2D974F26');
  const chainId = monadTestnet.id;
  const { address: walletAddress } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [txDetails, setTxDetails] = useState<string>("");
  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  // 🟢 Check if Approved For All
  const { data: approvedForAll, refetch } = useReadContract({
    account: walletAddress,
    address: marketplaceContract,
    abi: contractABI,
    functionName: "isApprovedForAll",
    args: [nftAddress, walletAddress as any],
  });

  useEffect(() => {
    if (approvedForAll !== undefined) {
      setIsApproved(approvedForAll);
    }
  }, [approvedForAll]);

  // 🔵 Request Approval
  const approveMarketplaceForAll = async () => {
    if (!walletClient || !publicClient || !walletAddress) return alert("Wallet not connected");
    setIsPending(true);
    setTxDetails('');

    try {
      const tx = {
        account: walletAddress,
        address: nftAddress,
        abi: contractABI,
        functionName: "setApprovalForAll",
        args: [marketplaceContract, true],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
      refetch();
    } catch (error) {
      console.error("Approval Failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  // Fetch all NFTs owned by the user
  const { data: nftList, refetch: refetchNfts } = useReadContract({
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
      <div>
        {isApproved === null ? (
          <p>Checking approval status...</p>
        ) : isApproved ? (
          <p>✅ Approved for all NFTs</p>
        ) : (
          <Button onClick={approveMarketplaceForAll} disabled={isPending} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            {isPending ? "Approving..." : "Approve Marketplace for All"}
          </Button>
        )}
      </div>
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

      <Input
        id="quantity"
        type="text"
        value={nftAddress}
        onChange={(e) => setNftAddress(e.target.value as any)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        min="1"
      />
      <Button disabled={isPending || !walletAddress}
        onClick={() => refetchNfts()}
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
          <Input
            type="text"
            placeholder="Enter price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button onClick={listNFT} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">List NFT</Button>
        </div>
      )}
    </div>
  );
};

