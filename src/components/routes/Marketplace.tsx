import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import { Monad as monadTestnet } from '../../global-context/soneiumMainnet.ts';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import contractABI from "../../global-context/abi/Marketplace.ts";
import { Button, Input } from '../base/index.tsx';

export const Marketplace = () => {
  const [nftAddress, setNftAddress] = useState<Address>('0xaa1059a2475b547F6A6A3612e2889281a5a496f8');
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [marketplaceContract, setMarketplaceContract] = useState<Address>('0x29aba5F2f58bb6017Aa78276Aa21eCb82928e887');
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
    address: marketplaceContract,
    abi: contractABI,
    functionName: "getAllNFTsAccount",
    args: [nftAddress]
  });

  useEffect(() => {
    if (nftList) {
      setNfts(nftList as any);
    }
  }, [nftList]);

  async function listNFT(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      const [txDetails, setTxDetails] = useState<string>("");
      const [isPending, setIsPending] = useState(false);

      const tx = {
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

      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
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

