import styles from "./NftMint.module.css";
import {
  Button,
  Input,
  Label,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../base/index.tsx';
import { useMixpanel } from '../../global-context/mixpanelContext.tsx';
import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import { Monad as monadTestnet } from '../../global-context/soneiumMainnet.ts';
import {
  useAccount,
  useBalance,
  useChainId,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import NFT_ABI from "../../global-context/abi/DemoNFT.ts";
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/select/select.tsx";
import { IItemContract, nftMonaContracts as nftContracts } from "./Data.ts";

export const Minting = () => {
  const { isConnected, address } = useAccount();
  const mixpanel = useMixpanel();
  let didConnect = false;
  const [txDetails, setTxDetails] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const chainId = monadTestnet.id;
  const { address: walletAddress } = useAccount();
  const [nftContractAddress, setNftContractAddress] = useState<Address>(nftContracts[0].value);
  const [contracts] = useState<Array<IItemContract>>(nftContracts);
  const connectedId = useChainId();
  const isConnectedToMinato = connectedId === monadTestnet.id;
  const [quantity, setQuantity] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(''); // Countdown for whitelist
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false); // Toggle whitelist period
  const [isPublicOpen, setIsPublicOpen] = useState(false); // Toggle whitelist period
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const { data: whitelistStartTime, refetch: refetchWL } = useReadContract({
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

  const { data: publicMintStartTime, refetch: refetchPL } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "publicMintStartTime",
    args: [],
  });

  const { data: publicDuration } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "publicDuration",
    args: [],
  });

  const { data: baseURI, refetch: refreshBaseURI } = useReadContract({
    account: walletAddress,
    address: nftContractAddress,
    abi: NFT_ABI,
    functionName: "baseURI",
    args: [],
  });

  const { data: bal } = useBalance({
    address: walletAddress,
    chainId,
  });
  const isBalanceZero = bal?.value.toString() === "0";

  const { data: totalNFT, refetch } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "getAllTokenIds",
    args: [],
  });

  const fetchTokenURI = async (totalNFT: bigint[]) => {
    const metaData = await Promise.all(
      totalNFT.map(async (item) => {
        try {
          const { data } = await axios.get(baseURI ? `${baseURI.toString()}${item}` : '');
          return data
        } catch (error) {
          return ''
        }
      }));
    return metaData
  }

  useEffect(() => {
    if (totalNFT) {
      fetchTokenURI(totalNFT as any)
        .then((data) => {
          setMintedNFTs(data as any)
        })
        .catch(console.log)
        .finally(() => setIsPending(false));
    }
  }, [totalNFT]);

  useEffect(() => {
    if (isConnected && !didConnect) {
      didConnect = true
      mixpanel.identify(address)
      mixpanel.track('wallet-connect')
    }
  }, [isConnected]);

  async function mintWhitelistNft(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      setIsPending(true);
      setTxDetails("");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        value: parseEther((0.0001 * quantity).toString()),
        functionName: "whitelistMint",
        args: [quantity as any],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
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
        value: parseEther((0.0001 * quantity).toString()),
        functionName: "publicMint",
        args: [quantity as any],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
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
      const difference = whitelistStartTime && whitelistDuration ? (Number(whitelistStartTime) + Number(whitelistDuration)) * 1000 - now.getTime() : 0;

      if (difference <= 0) {
        setIsWhitelistOpen(false);
        setTimeLeft('');
        clearInterval(interval);
      } else {
        setIsWhitelistOpen(true);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [whitelistStartTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = publicMintStartTime && publicDuration ? (Number(publicMintStartTime) + Number(publicDuration)) * 1000 - now.getTime() : 0;

      if (difference <= 0) {
        setIsPublicOpen(false);
        setTimeLeft('');
        clearInterval(interval);
      } else {
        setIsPublicOpen(true);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [publicMintStartTime, publicDuration]);

  const handlechangeContract = async (address: Address) => {
    setNftContractAddress(address);
    try {
      await Promise.all([
        refreshBaseURI(),
        refetch(),
        refetchPL(),
        refetchWL()
      ]);
    } catch (error) {
      console.error("Error updating contract data:", error);
    }
    finally {
      setIsPending(false);
    }
  }

  async function withdraw(): Promise<void> {
    console.log(walletClient, publicClient, walletAddress);
    if (!walletClient || !publicClient || !walletAddress) return;
    try {
      setIsPending(true);
      setTxDetails("");
      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        functionName: "withdraw",
        args: [],
      } as const;
      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash,
      });
      setTxDetails(`https://testnet.monadexplorer.com/tx/${hash}`);
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen w-full font-sans bg-transparent">
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
        <div className={"basis-2/4 bg-transparent"}>
          <Select onValueChange={item => handlechangeContract(item as any)}>
            <SelectTrigger className="w-96 w-full">
              <SelectValue placeholder="Select a contract" defaultValue={nftContractAddress} />
            </SelectTrigger>
            <SelectContent className="w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {contracts.map((item, i) =>
                <SelectItem key={i} value={item.value}>{item.key}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className={"basis-2/4 bg-transparent"}>
          <Button disabled={isPending || !walletAddress || isBalanceZero || !isConnectedToMinato}
            onClick={withdraw}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Withdraw
          </Button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={"basis-3/4 w-full bg-transparent border rounded-sm mr-2"}>
          <div className="p-6 rounded-lg"> {isPending ? <>Loading...</> :
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mintedNFTs && mintedNFTs.map((nft: any, index) => (
                <div key={index} className={styles.backgroundItem}>
                  <div className="flex flex-row" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <img hidden={true}
                      src={nft.image}
                      alt={`NFT ${nft.id}`}
                      className="rounded-sm mb-2" style={{
                        height: '20vh', maxWidth: '100%', objectFit: 'cover'
                      }}
                    /></div>
                  <div className="flex flex-row">
                    <Label>NFT #{nft.tokenId}</Label>
                  </div>
                  <div className="flex flex-row">
                    <Label>{nft.name}</Label>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </div>
        <div className="basis-1/4 border rounded-sm p-4 bg-transparent">
          <div className="grid grid-flow-row grid-cols-4 gap-4">
            <div className="col-span-4">
              <h2 className="text-xl font-bold">Mint NFTs</h2>
            </div>
            {isWhitelistOpen ? <>
              <div className="col-span-4">
                <h4>Whitelist Mint</h4>
              </div>
              <div className="col-span-4">
                <Label>Whitelist closes in: {timeLeft}</Label>
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
                    onClick={mintWhitelistNft}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Whitelist Mint
                  </Button>
                </div>
              </div>
            </> :
              <div className="col-span-4">
                <h4>Whitelist Mint Closed</h4>
              </div>}

            {!isWhitelistOpen && isPublicOpen ? <>
              <div className="col-span-4">
                <h4 className="text-xm font-bold">Public Mint</h4>
              </div>
              <div className="col-span-4">
                <Label>Public closes in: {timeLeft}</Label>
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
            </> : <div hidden={isWhitelistOpen} className="col-span-4">
              <h4>Public Mint Closed</h4>
            </div>}

            <div className="col-span-4">
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
                    Please connect to Monad Testnet
                  </span>

                  <button
                    className={styles.buttonSwitchChain}
                    onClick={() => switchChain({ chainId })}
                  >
                    Switch to Monad Testnet
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
              {/* <img
                src="https://gateway.pinata.cloud/ipfs/QmaHGo7pQ9x7B1rNvPbkzTnrZNuHA4mx53t8ZnAA8JFUG2/0.gif"
                alt='Image preview'
                className="w-full rounded-lg mb-2"
              /> */}
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
