import styles from "./NftMint.module.css";
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Input,
  Label,
} from '../base';
import { useMixpanel } from '../../global-context/mixpanelContext';
import { useEffect, useState } from 'react';
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
import axios from 'axios';

export const NftMint = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const mixpanel = useMixpanel();
  let didConnect = false;
  const [txDetails, setTxDetails] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const chainId = soneiumMinato.id;
  const { address: walletAddress } = useAccount();
  const nftContractAddress = "0x6a70B2274e9CF15D4770D8f782F79Ddab33692f5";
  const connectedId = useChainId();
  const isConnectedToMinato = connectedId === soneiumMinato.id;
  const [quantity, setQuantity] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(''); // Countdown for whitelist
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(true); // Toggle whitelist period
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const { data: totalNFT, refetch } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "balanceOf",
    args: [walletAddress as Address],
  });

  const { data: whitelistStartTime } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "whitelistStartTime",
    args: [],
  });

  const { data: whitelistDuration } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "whitelistDuration",
    args: [],
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

  useEffect(() => {
    if (isConnected && !didConnect) {
      didConnect = true
      mixpanel.identify(address)
      mixpanel.track('wallet-connect')
    }
  }, [isConnected])

  async function mintWhitelistNft(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      setIsPending(true);
      setTxDetails("");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.01 * quantity).toString()),
        functionName: "whitelistMint",
        args: [quantity as any],
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
        args: [quantity as any],
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = (Number(whitelistStartTime) + Number(whitelistDuration))*1000 - now.getTime();

      if (difference <= 0) {
        setIsWhitelistOpen(false);
        setTimeLeft('');
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [whitelistStartTime]);

  return (
    <div className="min-h-screen w-full p-6 font-sans bg-transparent">
      <div className="flex flex-row">
        <div className={"basis-3/4 m-2 border border-gray-300 rounded-lg p-4 bg-transparent"}>
          {/* Minted NFTs List */}
          <h2 className="text-xl font-bold text-left ml-6">Minted NFTs</h2>
          <div className="p-6 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mintedNFTs.map((nft: any, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
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
          <div className="grid grid-flow-row grid-cols-4 gap-4">
            <div className="col-span-4">
              <h2 className="text-xl font-bold">Mint NFTs</h2>
            </div>
            <div className="col-span-4">
              <h5 className="text-xm font-bold">Whitelist Mint</h5>
            </div>
            <div className="col-span-4">
              <Label>Whitelist closes in: {timeLeft}</Label>
            </div>
            {isWhitelistOpen ?
              <div className="col-span-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="1"
                  />
                  <Button disabled={isPending || !walletAddress || isBalanceZero || !isConnectedToMinato}
                    onClick={mintWhitelistNft}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Whitelist Mint
                  </Button>
                </div>
              </div> :
              <div className="col-span-4">
                <h4>Whitelist Mint Closed</h4>
              </div>}

            {!isWhitelistOpen ? <>
              <div className="col-span-4">
                <h4 className="text-xm font-bold">Public Mint</h4>
              </div>
              <div className="col-span-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="quantity">Quantity:</Label>
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
                    Public Mint
                  </Button>
                </div></div>
            </> : <></>}

            <div className="col-span-4">
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

            <div className="col-span-4">
              <Label>Total Minted:
                <span className="font-bold">{walletAddress && (
                  <span>{textNftBalances(totalNFT?.toString() || "0")}</span>
                )}</span>
              </Label>
            </div>

            <div className="col-span-4">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaHGo7pQ9x7B1rNvPbkzTnrZNuHA4mx53t8ZnAA8JFUG2/0.gif"
                alt='Image preview'
                className="w-full rounded-lg mb-2"
              />
            </div>

            <div className="col-span-4">
              <Label>Description: Heralding the dawn of NFT power users, OpenSea Pro unlocks a new level
                of optionality, selection, and control for pro NFT collectors.
                Previously known as Gem, OpenSea Pro has been months in the making,
                culminating in the platform’s rebirth as the most powerful NFT
                marketplace aggregator. Commemorating our community’s journey, we are
                releasing Gemesis, a thank you to Gem community members who have steered
                the ship with us. This limited-edition collection encapsulates our
                evolution, celebrates our community, and embodies the exciting road
                ahead. [OpenSea Pro](<a target="_blank" className="text-blue-600 visited:text-purple-600 hover:underline" href="https://pro.opensea.io">https://pro.opensea.io</a>)</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
