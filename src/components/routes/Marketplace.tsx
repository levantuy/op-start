import styles from "./NftMint.module.css";
import { useEffect, useState } from 'react';
import { Address, formatEther, parseEther } from 'viem';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWalletClient
} from "wagmi";
import contractABI from "../../global-context/abi/Marketplace.ts";
import NFT_ABI from "../../global-context/abi/DemoNFT.ts";
import { Button, Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '../base/index.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/select/select.tsx";
import { nftMonaContracts, marketplaceContract, metadataDefault, IItemContract } from "./Data.ts";
import { Label } from "@radix-ui/react-label";
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import * as Slider from '@radix-ui/react-slider';

export const Marketplace = () => {
  const { id } = useParams();
  const [nftAddress, setNftAddress] = useState<IItemContract>(); // Default NFT contract address
  interface NFTItem {
    tokenId: number;
    seller: string;
    price: string;
    active: boolean;
    metadata: any;
  }
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const { address: walletAddress } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txDetails, setTxDetails] = useState<string>("");
  const [selectedNFTs, setSelectedNFTs] = useState<Set<number>>(new Set());
  const [value, setValue] = useState(0);
  const min = 0;
  const connectedId = useChainId();

  useEffect(() => {
    if (nftMonaContracts.length > 0) {
      const found = nftMonaContracts.find(contract => contract.value === id);
      setNftAddress(found || nftMonaContracts[0]);
    }
  }, [nftMonaContracts, id]);

  const { data: walletClient } = useWalletClient({
    chainId: connectedId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId: connectedId,
  });

  const { data: baseURI, refetch: refreshBaseURI, isFetched } = useReadContract({
    account: walletAddress,
    address: nftAddress?.value as Address,
    abi: NFT_ABI,
    functionName: "baseURI",
    args: [],
  });

  // Fetch all NFTs of nftAddress
  const { data: nftList, refetch: refetchNfts } = useReadContract({
    account: walletAddress,
    address: marketplaceContract,
    abi: contractABI,
    functionName: "getNFTsByContract",
    args: [nftAddress?.value as Address],
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
    if (nftList && isFetched) {
      fetchTokenURI(nftList)
        .then(data => {
          setNfts(Array.from(data).filter(item => item.seller !== walletAddress))
        })
        .catch(console.log)
        .finally(() => setIsPending(false));
    }
  }, [nftList, isFetched]);

  const handlechangeContract = async (address: Address) => {
    setIsPending(true);
    setNftAddress(nftMonaContracts.find(contract => contract.value === address));

    try {
      await Promise.all([
        refreshBaseURI(),
        refetchNfts()
      ]);
    }
    catch (error) {
      console.error("Error updating contract data:", error);
    }
    finally {
      setIsPending(false);
      clearData();
    }
  }

  async function buyNFT(tokenId: Number, price: string): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    setIsPending(true);

    try {
      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "buyNFT",
        value: parseEther(price),
        args: [nftAddress?.value, tokenId],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });

      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
      refetchNfts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
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

  const buySelectedNFTs = async () => {
    if (!walletClient || !publicClient || !walletAddress) return;
    if (selectedNFTs.size === 0) return;

    setIsPending(true);

    try {
      let total = 0;
      for (const tokenId of selectedNFTs) {
        const nft = nfts.find((item: any) => item.tokenId === tokenId) as any;
        if (!nft || nft.seller === walletAddress) continue;
        const price = Number(nft.price);
        total = Math.round((total + price) * 100) / 100 // Làm tròn đến 2 chữ số thập phân;
      }

      const tx = {
        account: walletAddress,
        address: marketplaceContract,
        abi: contractABI,
        functionName: "buyListNFT",
        value: parseEther(total.toString()),
        args: [nftAddress?.value, Array.from(selectedNFTs)],
      } as const;

      const { request } = await publicClient.simulateContract(tx as any);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      clearData();
      refetchNfts();
    } catch (error) {
      console.error("Error buying selected NFTs:", error);
    } finally {
      setIsPending(false);
    }
  };

  const clearData = () => {
    setTxDetails("");
    setSelectedNFTs(new Set());
    setValue(0);
  }

  const sliderChangeHandler = (value: number) => {
    setValue(value);
    setSelectedNFTs(new Set());

    if (value === 0 || nfts.length === 0) return;

    for (let i = 0; i < value; i++) {
      const nft = nfts[i];
      if (!nft || nft.seller === walletAddress) continue;

      setSelectedNFTs(prev => {
        const newSet = new Set(prev);
        const tokenId = nft.tokenId;
        if (newSet.has(tokenId)) newSet.delete(tokenId);
        else newSet.add(tokenId);
        return newSet;
      });
    }
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
        <div className={"basis-2/4 bg-transparent mr-2"}>
          <Select onValueChange={item => handlechangeContract(item as Address)} value={nftAddress?.value}>
            <SelectTrigger className="w-96 w-full">
              <SelectValue placeholder="Select a contract"/>
            </SelectTrigger>
            <SelectContent className="w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {nftMonaContracts.map((item, i) =>
                <SelectItem key={i} value={item.value}>{item.key}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className={"basis-2/4 bg-transparent mr-2"}>
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
            <Button
              onClick={buySelectedNFTs}
              disabled={selectedNFTs.size === 0}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Buy {selectedNFTs.size} now
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={"basis-4/4 w-full bg-transparent border rounded-sm"}>
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
                    <img
                      src={nft.metadata.image}
                      alt={`NFT ${nft.metadata.name}`}
                      className="rounded-sm mb-2" style={{
                        height: '20vh', maxWidth: '100%', objectFit: 'cover'
                      }}
                    /></div>
                  <div className="flex flex-row">
                    <Label>NFT #{nft.tokenId}</Label>
                  </div>
                  <div className="flex flex-row">
                    <Label>Name: {nft.metadata.name}</Label>
                  </div>
                  <div className="flex flex-row">
                    <Label>Price: {nft.price}</Label>
                  </div>
                  <div className="flex justify-between w-full">
                    <Button disabled={nft.seller == walletAddress} onClick={() => buyNFT(nft.tokenId, nft.price)}
                      className={styles.buttonAction}>Buy NFT</Button>
                    <Button
                      type="button"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => toggleSelect(nft.tokenId)}
                      disabled={nft.seller === walletAddress}
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

