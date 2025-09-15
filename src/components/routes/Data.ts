import { Address } from "abitype";

interface IItemContract { chainId: number, key: string, value: Address, image: string, description: string };

const nftMonaContracts: Array<IItemContract> = [
    { chainId: 59144, key: 'Linea Contract NFT', value: '0x6960e382968F1bAb30794a7bc8443dEc257Be1Be', image: 'https://i.postimg.cc/c1RLMKz3/linea-contract.png', description: 'Linea Contract NFT' },
    { chainId: 59144, key: 'Linea TGE', value: '0xb919e0B0255359B067ED9C3B5F8723A33e9a1d0A', image: 'https://i.postimg.cc/XYH88Bd0/linea-nft.png', description: 'Linea Nft' },
    { chainId: 10, key: 'Optimism NFT', value: '0xa4661ABF257cDe99e9E46ad68F69d2304c1Bd8Bf', image: 'https://i.postimg.cc/1zmBTRRb/1a82bad1-0cf6-42ca-95b7-387c59821a3a.png', description: 'Optimism Nft' },
    { chainId: 10, key: 'Optimism TGE', value: '0x770D28d0d4e50a2b550786900BDc012b95b9eb8B', image: 'https://i.postimg.cc/XYH88Bd0/linea-nft.png', description: 'Optimism TGE' },    
    { chainId: 10143, key: 'Buddha', value: '0x7164A656B89649AE545814EB30Aa035C51e077Cc', image: 'https://i.postimg.cc/fLx2YMGs/buddha.jpg', description: 'Buddha on Web3' },
    { chainId: 10143, key: 'Minting Nft', value: '0x90Ef5Bc03eb500ee07A9CB714FC52f667B6ef94f', image: 'https://i2.seadn.io/base/0x08bee2bc026d6fb6b50a9d4040a374721d6a6c67/85c75e5f0118ad8665b9a20515c162/dc85c75e5f0118ad8665b9a20515c162.png?w=1000', description: 'Minting' },
    { chainId: 10143, key: 'ETH ATH', value: '0xCD396f096e2F69E50c2B7f5FF8827C0311901887', image: 'https://i.postimg.cc/fRy6Fhn1/eth-uptrend.png', description: 'ETH new ATH soon' },
    { chainId: 10143, key: 'Opensea studio 2.0 with AI', value: '0xcE41f8b0d0736A40d50912d63ddB0f7c888ED830', image: 'https://i2.seadn.io/base/0x3db8898291c666777667c802a4972d1aadc7e0b3/f507dc682bcf5ee40ddfa94cd4a831/d2f507dc682bcf5ee40ddfa94cd4a831.png', description: 'Opensea studio 2.0 with AI' },
    { chainId: 10143, key: 'Downtrend Nft', value: '0x8722A14e6804186F07FAB15E7C603c8dd59Df0ef', image: 'https://i.postimg.cc/brPB3jH3/downtrend.png', description: 'Downtrend Nft' },
    { chainId: 10143, key: 'BTC ATH Nft', value: '0xd4c9b611b301Ac008E4C0ee7a86a78c6c9687C17', image: 'https://i.postimg.cc/9fpQKR28/btc-ath.png', description: 'BTC ATH Nft' },
    { chainId: 10143, key: 'Hunter Nft', value: '0x3C345fAa3c7440075E2214086a9954a86DE54DeC', image: 'https://i.postimg.cc/VNd1nBm0/hunter.avif', description: 'Hunter Nft on Starknet' },
    { chainId: 10143, key: 'Influencer Nft', value: '0x81EeCd8d7268ac6368fF96c4E853F3a83144E035', image: 'https://i.postimg.cc/NjHjdmR7/Influencer.avif', description: 'Influencer Nft on Starknet' },
    { chainId: 10143, key: 'Farmer Nft', value: '0x75ca41C3362aAfC442523486B05e4FbdB33702Ac', image: 'https://i.postimg.cc/HkPbK4Z7/Farmer.avif', description: 'Farmer Nft on Starknet' },
    { chainId: 10143, key: 'Builder Nft', value: '0x9e11507AaE27F8c8EE1929E4b9EcDe4F211b5C39', image: 'https://i.postimg.cc/TwdN6tvP/builder.avif', description: 'Builder Nft on Starknet' },
    { chainId: 10143, key: 'AI Agent', value: '0xDCfef6d4F9Ac26b0982fEf22b55F1bFf4Bf36188', image: 'https://i.postimg.cc/MZC9LdT1/ai-agent.jpg', description: 'AI Agent' },
    { chainId: 10143, key: 'Photographer', value: '0x8D5473AE7d5D12bf23E582C19F2cf7828B8A16EC', image: 'https://i.postimg.cc/Y0bLQrGn/photographer.jpg', description: 'Photographer' },
    { chainId: 10143, key: 'ICE', value: '0xFA13E0dd0ad4c7974D3A15f0FC3E2bfaF1ec9cBF', image: 'https://i.postimg.cc/W1rxDdLQ/picture.jpg', description: 'Ice Nft' },
    { chainId: 10143, key: 'Alp', value: '0x2275b3FC510117e2357Bac8223510F8C82Bc19bF', image: 'https://i.postimg.cc/1Rgbmvrt/monad.jpg', description: 'Alpha Nft' },
    { chainId: 10143, key: 'Bull', value: '0x8218b425B81E36C56D80Ad95c880FCd5C4b5B088', image: 'https://i.postimg.cc/7hz6Dcxx/bear.jpg', description: 'Bull Nft' },
    { chainId: 10143, key: 'Bear', value: '0x21b36F89C157742104F21d356b8B1E3F774d959B', image: 'https://i.postimg.cc/7hz6Dcxx/bear.jpg', description: 'Bear Nft' },
    { chainId: 10143, key: 'Zora', value: '0xa05B082C80614aD6Ac83211D231aE906BfabD1BA', image: 'https://i.postimg.cc/Kj4c0h2Q/zora.webp', description: 'Zora coin' },
    { chainId: 10143, key: 'Base', value: '0x2f1Be96A9E43899086c9DA2b5F90194287144F1B', image: 'https://i.postimg.cc/mr97tzN8/base.webp', description: 'Base meme coin' },
    { chainId: 10143, key: 'ZKSwap', value: '0xcA591d96cF1F88847172Ab1fa0543A482b531dD9', image: 'https://i.postimg.cc/Nf1HwS9T/flying-coin.webp', description: 'The First Swap2Earn Platform' },
    { chainId: 10143, key: 'Farmer', value: '0x838Bd7A522cb793f484A5Ca0B69A82dd21873aDb', image: 'https://i.postimg.cc/7ZYZzq59/Farmer.avif', description: 'Farmer airdrop.' },
    { chainId: 10143, key: 'Zora', value: '0xdbbB34A307Cba3352A0d4A425aE04e071204C0ed', image: 'https://i.postimg.cc/L43zXJJc/zora.webp', description: 'Zora is a new kind of social network.' },
    { chainId: 10143, key: 'Zoë Mozert', value: '0x92a20330706FF8601b7A541D7d5Ebb4B8979F074', image: 'https://i.postimg.cc/9MhG2N4g/Zo-Mozert.jpg', description: 'In 1925 Mozert entered the Pennsylvania Museum School of Industrial Art where she studied under Thornton Oakley, a former student of Howard Pyle, and modeled to raise money for tuition' },
    { chainId: 10143, key: 'Nam Truong', value: '0x6c97F7C4e511620a70b0aB61fc1A6b8185988E45', image: 'https://i.postimg.cc/XYvfxtGP/nam-truong.jpg', description: 'Nam Truong. ' },
    { chainId: 10143, key: 'Adele', value: '0x465E50c6AC477DF9187F1a0c30bb3Bd2ddCA8A7A', image: 'https://i.postimg.cc/brgq447G/l-Ca-TNth-U5s6r-N8-TQ9-UXT8-Zt1v1w.jpg', description: 'Adele Laurie Blue Adkins (born 5 May 1988) is an English singer and songwriter. After graduating in arts from the BRIT School in 2006, Adele signed a record deal with XL Recordings. Her debut album, 19, was released in 2008 and spawned the UK top-five singles "Chasing Pavements" and "Make You Feel My Love". ' },
    { chainId: 10143, key: 'Taylor Swift', value: '0xDEcC68B46d2DEF6234a8EfC84E462c6504cFBD52', image: 'https://i.postimg.cc/4NQmwhQK/taylor-swift.webp', description: 'Love Selena Gomez' },
    { chainId: 10143, key: 'Selena Gomez', value: '0xD722A68D0A1891297ef8E3B086597c0cC83A34Bd', image: 'https://i.postimg.cc/3Rvp5XDY/selena-Gomez.jpg', description: 'Love Selena Gomez' },
    { chainId: 10143, key: 'Monad Nft 6', value: '0x6364A78A80D3fb3B681A4b75b8dDc38A856531De', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { chainId: 10143, key: 'Monad Nft 3', value: '0x2A75C1EC766435Edc2DBc7B8ECEE0178959d6CB4', image: 'https://i.postimg.cc/Hnx3vJL4/cat.avif', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { chainId: 10143, key: 'Monad Nft 4', value: '0x4099f7b986fFee4F3Ef335d9dD7c348cBDEE7F33', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { chainId: 10143, key: 'Monad Nft 5', value: '0x8F46F32C23643687f46631df00B3a90A6D1748D6', image: 'https://i.postimg.cc/Hnx3vJL4/cat.avif', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { chainId: 10143, key: 'Monad Sexy', value: '0x31B9f3F0268aFD1c6f037f576284bc86f4C0F610', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { chainId: 10143, key: 'Girl Sexy', value: '0x8b326526a82cB44e1911FB2A9f14A8f4711E2206', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
];

const marketContracts: Array<any> = [
    {chainId: 10143, key: 'Monad', value: '0xcb3D323aA579511874D5c7FBc905ec411d06Bd31'},
    {chainId: 59144, key: 'Linea', value: '0xe27Ee4CdDF7794cE36AEAb0Ebff3eDb73A892410'},
];

const metadataDefault = {
    "name": "Girl NFT",
    "tokenId": 1,
    "image": "https://i.postimg.cc/bv0KKFxy/91.jpg",
    "description": "Girl NFT",
    "attributes": [
        {
            "trait_type": "Background",
            "value": "Brown"
        },
        {
            "trait_type": "Body Color",
            "value": "Black"
        },
        {
            "trait_type": "Eyes",
            "value": "Red"
        },
        {
            "trait_type": "Bullet Color",
            "value": "Yellow"
        }
    ]
};

export {
    nftMonaContracts, marketContracts, metadataDefault
}

export type { IItemContract };