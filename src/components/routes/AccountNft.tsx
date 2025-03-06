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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/select/select.tsx";
import { IItemContract, nftMonaContracts } from "./Data.ts";
import { Label } from "@radix-ui/react-label";

export const AccountNft = () => {
  const [nftAddress, setNftAddress] = useState<Address>('0xaa1059a2475b547F6A6A3612e2889281a5a496f8');
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [marketplaceContract] = useState<Address>('0x3b32C9Ada9DaB66760f74F89866361015Af3Cf3C');
  const chainId = monadTestnet.id;
  const { address: walletAddress } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [txDetails, setTxDetails] = useState<string>("");
  const [contracts] = useState<Array<IItemContract>>(nftMonaContracts);
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

    if (!isApproved) await approveMarketplaceForAll();

    try {
      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "listNFT",
        args: [nftAddress, selectedNFT, parseEther(price)],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      
      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
      setSelectedNFT(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  const handlechangeContract = (address: Address) => {
    setNftAddress(address);
    refetch();
    refetchNfts();
  }

  return (
    <div className="w-full">
      <div className="flex flex-row">
        <div className={"basis-1/2 bg-transparent"}>
          <Select onValueChange={item => handlechangeContract(item as any)}>
            <SelectTrigger className="w-96 w-full">
              <SelectValue placeholder="Select a contract" defaultValue={nftAddress} />
            </SelectTrigger>
            <SelectContent className="w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {contracts.map((item, i) =>
                <SelectItem key={i} value={item.value}>{item.key}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className={"basis-1/4 bg-transparent"}>
          {isApproved === null ? (
            <p>Checking approval
              status...</p>
          ) : isApproved ? (
            <p>✅ Approved for all NFTs</p>
          ) : (
            <Button onClick={approveMarketplaceForAll} disabled={isPending} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              {isPending ? "Approving..." : "Approve Marketplace for All"}
            </Button>
          )}
        </div>
        <div className={"basis-1/4 bg-transparent"}>
          {txDetails && (
            <div className={styles.txDetails}>
              <span>🎉 Congrats! 🐣<a
                href={txDetails}
                target="_blank"
                rel="noreferrer"
                className={styles.txLink}
              >
                View transaction
              </a> </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <div className={"basis-4/4 w-full bg-transparent"}>
          <div className={"m-2 border border-gray-300 rounded-lg p-4 bg-transparent"}>
            {/* Minted NFTs List */}
            <div className="p-6 rounded-lg"> {isPending ? <>Loading...</> :
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.length > 0 && nfts.map((nft: any, index) => (
                  <div key={index} className={styles.backgroundItem}>
                    {/* <div className="flex flex-row" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <img
                      src={nft.image}
                      alt={`NFT ${nft.id}`}
                      className="rounded-sm mb-2" style={{
                        height: '20vh', maxWidth: '100%', objectFit: 'cover'
                      }}
                    /></div> */}
                    <div className="flex flex-row">
                      <Label>NFT #{nft}</Label>
                    </div>
                    <div>
                      {selectedNFT && selectedNFT === nft ? <>
                        <Input
                          type="text"
                          placeholder="Enter price in MON"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Button onClick={listNFT} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">List NFT</Button>
                      </> : <>
                        <Button onClick={() => setSelectedNFT(nft)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">List NFT</Button>
                      </>}
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

