import styles from "./NftMint.module.css";
import { useEffect, useState } from 'react';
import { Address, ContractFunctionExecutionError, formatEther, parseEther } from 'viem';
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
import { IItemContract, nftMonaContracts, marketContracts, metadataDefault, linkScans } from "./Data.ts";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { motion } from 'framer-motion';
import { decodeErrorResult } from 'viem';
import * as Slider from '@radix-ui/react-slider';

export const AccountNft = () => {
  const [nftAddress, setNftAddress] = useState<IItemContract>(); // Default NFT contract address
  interface NFTItem {
    tokenId: number;
    seller: string;
    price: string;
    active: boolean;
    metadata: any;
  }
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const { address: walletAddress, chain } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [txDetails, setTxDetails] = useState<string>("");
  const [nftContracts, setNftContracts] = useState(nftMonaContracts.filter(contract => contract.chainId === chain?.id));
  const [selectedNFTs, setSelectedNFTs] = useState<Set<number>>(new Set());
  const [value, setValue] = useState(0);
  const min = 0;
  const [marketplaceContract, setMarketplaceContract] = useState(marketContracts.find(market => market.chainId === chain?.id)?.value as Address);
  const [txnLink, setTxnLink] = useState(linkScans.find(link => { return link.chainId === chain?.id }));

  const { data: walletClient } = useWalletClient({
    chainId: chain?.id,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId: chain?.id,
  });

  // 🟢 Check if Approved For All
  const { data: approvedForAll, refetch } = useReadContract({
    account: walletAddress,
    address: marketplaceContract,
    abi: contractABI,
    functionName: "isApprovedForAll",
    args: [nftAddress?.value as Address, walletAddress as any],
  });

  useEffect(() => {
    setNftContracts(nftMonaContracts.filter(contract => contract.chainId === chain?.id));
    setMarketplaceContract(marketContracts.find(market => market.chainId === chain?.id)?.value as Address);
    setTxnLink(linkScans.find(link => { return link.chainId === chain?.id }));
  }, [chain]);

  useEffect(() => {
    if (nftContracts.length > 0) {
      setNftAddress(nftContracts[0]);
    }
  }, [nftContracts]);

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
        address: nftAddress?.value as Address,
        abi: contractABI,
        functionName: "setApprovalForAll",
        args: [marketplaceContract, true],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setTxDetails(txnLink.value + hash);
      refetch();
    } catch (error) {
      console.error("Approval Failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  const { data: baseURI, refetch: refreshBaseURI } = useReadContract({
    account: walletAddress,
    address: nftAddress?.value as Address,
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
    args: [nftAddress?.value as Address, walletAddress as any]
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
        args: [nftAddress?.value as Address, selectedNFT, parseEther(price)],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setTxDetails(txnLink.value + hash);
      clearData();
      refetchNfts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  const clearData = () => {
    setSelectedNFT(null);
    setPrice("0");
    setTxDetails("");
    setSelectedNFTs(new Set());
    setValue(0);
  }

  const handlechangeContract = async (address: Address) => {
    setIsPending(true);
    setNftAddress(nftContracts.find(contract => contract.value === address));

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
      clearData();
    }
  }

  const toggleSelect = (tokenId: number) => {
    setSelectedNFTs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  const listSelectedNFTs = async () => {
    if (!walletClient || !publicClient || !walletAddress) return;
    if (selectedNFTs.size === 0) return;

    setIsPending(true);
    if (!isApproved) await approveMarketplaceForAll();

    try {
      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "listNFTs",
        args: [nftAddress?.value as Address, Array.from(selectedNFTs), Array.from(selectedNFTs).map(() => price ? parseEther(price) : parseEther("0"))],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      clearData();
      refetchNfts();
    } catch (error: any) {
      if (error instanceof ContractFunctionExecutionError) {
        const decoded = decodeErrorResult({
          abi: contractABI,
          data: error.message as any,
        });
        console.error("Decoded error:", decoded);
      }
      console.error("Error buying selected NFTs:", error);
    } finally {
      setIsPending(false);
    }
  };

  const sliderChangeHandler = (value: number) => {
    const newSelectedNFTs = new Set<number>();
    setSelectedNFTs(new Set());
    setValue(value);
    if (value === 0 || nfts.length === 0) return;

    for (let i = 0; i < value; i++) {
      newSelectedNFTs.add(nfts[i].tokenId);
    }
    setSelectedNFTs(newSelectedNFTs);
  }

  const increment = () => {
    sliderChangeHandler(value + 1);
  }

  const decrement = () => {
    sliderChangeHandler(value - 1);
  }

  const inputChange = (e: any) => {
    const val = Math.max(min, Math.min(Number(e.target.value), nfts.length));
    setValue(val);
    sliderChangeHandler(val);
  };

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
        <div className={"basis-1/2 bg-transparent mr-2"}>
          <Select onValueChange={item => handlechangeContract(item as any)} value={nftAddress?.value as Address}>
            <SelectTrigger className="w-96 w-full">
              <SelectValue placeholder="Phương Thúy" />
            </SelectTrigger>
            <SelectContent className="w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {nftContracts.map((item, i) =>
                <SelectItem key={i} value={item.value}>{item.key}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className={"basis-1/2 bg-transparent flex justify-start items-center"}>
          <div className="flex flex-row">
            <Slider.Root
              className="relative flex w-[140px] items-center select-none touch-none mr-2"
              max={nfts.length}
              step={1}
              onValueChange={(value) => sliderChangeHandler(value[0])}
              value={[selectedNFTs.size ? selectedNFTs.size : 0]}
            >
              <Slider.Track className="bg-gray-200 relative h-2 w-full grow overflow-hidden rounded-full">
                <Slider.Range className="absolute h-full bg-blue-500" />
              </Slider.Track>
              <Slider.Thumb className="block size-4 rounded-full bg-blue-500 shadow-sm transition-colors" />
            </Slider.Root>

            {/* Custom Number Input */}
            <div className="inline-flex items-center whitespace-nowrap rounded-lg transition duration-200 placeholder:text-gray-400 border border-gray-300 gap-1 text-sm px-2.5 font-mono w-[105px] shrink-0 mr-2">
              <div className="flex items-center min-w-fit">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={value <= min}
                  className="inline-flex items-center border-0 cursor-pointer text-gray-800 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <svg
                    aria-label="Remove"
                    className="fill-current"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                  >
                    <path d="M200-440v-80h560v80H200Z" />
                  </svg>
                </button>
              </div>

              <input
                type="number"
                min={min}
                max={nfts.length}
                value={value}
                onChange={e => inputChange(e)}
                placeholder="0"
                className="text-sm w-full border-0 bg-transparent text-center [appearance:textfield] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <div className="flex items-center min-w-fit">
                <button
                  type="button"
                  onClick={increment}
                  disabled={value >= nfts.length}
                  className="inline-flex items-center border-0 cursor-pointer text-gray-800 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <svg
                    aria-label="Add"
                    className="fill-current"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </button>
              </div>
            </div>

            <Input
              type="text"
              placeholder="Enter price in MON"
              title="Price in MON"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-48 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none mr-2"
            />

            <Button disabled={selectedNFTs.size ? false : true} className={styles.button || ' mr-2'} onClick={listSelectedNFTs}>List {selectedNFTs.size} same price</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={"basis-4/4 w-full bg-transparent border rounded-sm"}>
          {/* Minted NFTs List */}
          <div className="p-6 rounded-lg"> {isPending ? <>Loading...</> :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {nfts.length > 0 && nfts.map((nft: any, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={styles.backgroundItem}
                  style={{ padding: '10px' }}
                >
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
                  </div> : <>Not listing</>}
                  <div className="flex justify-between w-full">
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
                    <Button
                      type="button"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => toggleSelect(nft.tokenId)}
                    >
                      {selectedNFTs.has(nft.tokenId) ? (
                        <svg
                          aria-label="Check Circle"
                          className="fill-blue-3 m-[-3px] animate-in fade-in"
                          fill="currentColor"
                          height="38"
                          role="img"
                          viewBox="0 -960 960 960"
                          width="38"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="fill-white"
                            d="m424 -296 282 -282-56 -56 -226 226 -114-114-56 56 170 170Z"
                            fill="blue"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          aria-label="Add"
                          className="fill-current rounded-full bg-black/80 animate-in fade-in"
                          fill="currentColor"
                          height="32"
                          role="img"
                          viewBox="0 -960 960 960"
                          width="32"
                          xmlns="http://www.w3.org/2000/svg"
                          color="white"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></path>
                        </svg>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

