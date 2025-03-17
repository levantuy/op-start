import styles from "./NftMint.module.css";
import { useEffect, useState } from 'react';
import { Address, formatEther, parseEther } from 'viem';
import { Monad as monadTestnet } from '../../global-context/soneiumMainnet.ts';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient
} from "wagmi";
import contractABI from "../../global-context/abi/Marketplace.ts";
import NFT_ABI from "../../global-context/abi/DemoNFT.ts";
import { Button, Input, Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '../base/index.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/select/select.tsx";
import { IItemContract, nftMonaContracts, marketplaceContract, metadataDefault } from "./Data.ts";
import { Label } from "@radix-ui/react-label";
import axios from "axios";

export const AccountNft = () => {
  const [nftAddress, setNftAddress] = useState<Address>(nftMonaContracts[0].value);
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
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

  const { data: baseURI, refetch: refreshBaseURI } = useReadContract({
    account: walletAddress,
    address: nftAddress,
    abi: NFT_ABI,
    functionName: "baseURI",
    args: [],
  });

  // Fetch all NFTs owned by the user
  const { data: nftList, refetch: refetchNfts } = useReadContract({
    account: walletAddress,
    address: marketplaceContract,
    abi: contractABI,
    functionName: "getAllNFTsAccount",
    args: [nftAddress, walletAddress as any]
  });

  const fetchTokenURI = async (tokenURI: any) => {
    const metaData = await Promise.all(
      tokenURI.map(async (listing: any) => {
        let itemRes = {
          tokenId: Number(listing.tokenId),
          seller: listing.seller,
          price: formatEther(listing.price),
          active: listing.active, 
          metadata: metadataDefault
        };

        try {
          const { data } = await axios.get(baseURI ? `${baseURI.toString()}${listing.tokenId}` : '');
          return { ...itemRes, metadata: data };
        } catch (error) {
          return itemRes;
        }
      })
    )
    return metaData
  }

  useEffect(() => {
    if (nftList) {
      fetchTokenURI(nftList)
        .then((data) => {
          setNfts(data as any)
        })
        .catch(console.log)
        .finally(() => setIsPending(false));
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
      refetchNfts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  const handlechangeContract = async (address: Address) => {
    setIsPending(true);
    setNftAddress(address);
    setTxDetails("");
    
    try {
      await Promise.all([
        refreshBaseURI(),
        refetch(),
        refetchNfts(),
      ]);
    } catch (error) {
      console.error("Error updating contract data:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full">
      <ToastProvider>
        {!isPending && txDetails && (
          <Toast onOpenChange={setIsPending} variant="default">
            <div className="flex flex-col space-y-2">
              <ToastTitle>Congrats! 🐣</ToastTitle>
              <ToastDescription><a
                href={txDetails}
                target="_blank"
                rel="noreferrer"
                className={styles.txLink}
              >
                View transaction
              </a></ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
      <div className="flex flex-row mb-2">
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
      </div>
      <div className="flex flex-row">
        <div className={"basis-4/4 w-full bg-transparent border rounded-sm"}>
          {/* Minted NFTs List */}
          <div className="p-6 rounded-lg"> {isPending ? <>Loading...</> :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {nfts.length > 0 && nfts.map((nft: any, index) => (
                <div key={index} className={styles.backgroundItem}>
                  <div className="flex flex-row" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {nft.metadata && <img
                      src={nft.metadata.image}
                      alt={`NFT ${nft.metadata.name}`}
                      className="rounded-sm mb-2" style={{
                        height: '20vh', maxWidth: '100%', objectFit: 'cover'
                      }}
                    />}</div>
                  <div className="flex flex-row">
                    <Label>NFT #{nft.tokenId}</Label>
                  </div>
                  <div className="flex flex-row">
                    <Label>Name: {nft.metadata.name}</Label>
                  </div>
                  {nft.active ? <div className="flex flex-row">
                    <Label>Price: {nft.price}</Label>
                  </div> : <></>}
                  <div>
                    {selectedNFT && selectedNFT === nft.tokenId ? <>
                      <Input
                        type="text"
                        placeholder="Enter price in MON"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <Button onClick={listNFT} className={styles.buttonAction}>List NFT</Button>
                    </> : <>
                      <Button onClick={() => setSelectedNFT(nft.tokenId)} className={styles.buttonAction}>{nft.active ? 'Edit' : 'List'}</Button>
                    </>}
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

