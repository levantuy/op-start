import "./Collection.css";
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
import { IItemContract, nftMonaContracts as slides, marketplaceContract, metadataDefault } from "./Data.ts";
import axios from 'axios';
import { AspectRatio } from "radix-ui";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from "../base/index.tsx";
import { useNavigate } from "react-router-dom";

export const Collection = () => {
  const [nftAddress, setNftAddress] = useState<Address>(slides[slides.length - 1].value);
  const [nfts, setNfts] = useState([]);
  const chainId = monadTestnet.id;
  const { address: walletAddress } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txDetails, setTxDetails] = useState<string>("");
  const [contracts] = useState<Array<IItemContract>>(slides);
  const navigate = useNavigate();

  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const { data: baseURI, refetch: refreshBaseURI, isFetched } = useReadContract({
    account: walletAddress,
    address: nftAddress,
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
    args: [nftAddress]
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
        .then((data) => {
          setNfts(data as any)
        })
        .catch(console.log)
        .finally(() => setIsPending(false));
    }
  }, [nftList, isFetched]);

  const handlechangeContract = async (address: Address) => {
    setIsPending(true);
    setNftAddress(address);
    setTxDetails("");

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
        args: [nftAddress, tokenId],
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

  return (
    <Swiper
      loop
      navigation={true}
      modules={[Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={3}
      pagination={{
        type: 'fraction', clickable: true 
      }}
      scrollbar={{ draggable: true }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={styles.backgroundItem}>
          <AspectRatio.Root ratio={16 / 9} className="rounded-lg overflow-hidden shadow-lg">
            <img src={slide.image} alt={slide.key} className="object-cover w-full h-full" />
          </AspectRatio.Root>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold">{slide.key}</h2>
            <p className="text-gray-600 mt-2">{slide.description}</p>
            <Button onClick={() => navigate('/marketplace')} className={styles.buttonAction}>Open Collection</Button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
