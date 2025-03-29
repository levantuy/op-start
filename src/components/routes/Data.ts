import { Address } from "abitype";

interface IItemContract { key: string, value: Address, image: string, description: string };
const nftContracts: Array<IItemContract> =
    [{ key: 'Nice Token', value: "0xc2c84FBdF873468Fd6ae84A01B09F5DF39b5366b", image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Block Timestamp', value: "0x5414faE0f85B20D644916D872c1990011Ec933d7", image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Thuan Capital', value: '0xfB452D2e0E60fc990EC1dD0018b522FCAbdfF23B', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Mug Token', value: '0x17018B76BB88C62Ef468a5323aE4Ffd775C1f9C3', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Smart Contract Token', value: '0x2FE4E18eA571EA3b8bd9d1dAC6F3779a549A0f9F', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Just Like It', value: '0x2073C3260A5537CE9f3bb0292E49E6146d1405A9', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Keep Building', value: '0x984F27D333F066bbe1e08791D0f053ae9EA76392', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    { key: 'Cz Token', value: '0xEB117ffe3d71987550ebAEA2D9af2650310A1286', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    ];

const nftMonaContracts: Array<IItemContract> =
    [
        { key: 'Zoë Mozert', value: '0x6c97F7C4e511620a70b0aB61fc1A6b8185988E45', image: 'https://i.postimg.cc/9MhG2N4g/Zo-Mozert.jpg', description: 'In 1925 Mozert entered the Pennsylvania Museum School of Industrial Art where she studied under Thornton Oakley, a former student of Howard Pyle, and modeled to raise money for tuition'},
        { key: 'Nam Truong', value: '0x6c97F7C4e511620a70b0aB61fc1A6b8185988E45', image: 'https://i.postimg.cc/XYvfxtGP/nam-truong.jpg', description: 'Nam Truong. '},
        { key: 'Adele', value: '0x465E50c6AC477DF9187F1a0c30bb3Bd2ddCA8A7A', image: 'https://i.postimg.cc/brgq447G/l-Ca-TNth-U5s6r-N8-TQ9-UXT8-Zt1v1w.jpg', description: 'Adele Laurie Blue Adkins (born 5 May 1988) is an English singer and songwriter. After graduating in arts from the BRIT School in 2006, Adele signed a record deal with XL Recordings. Her debut album, 19, was released in 2008 and spawned the UK top-five singles "Chasing Pavements" and "Make You Feel My Love". '},
        { key: 'Taylor Swift', value: '0xDEcC68B46d2DEF6234a8EfC84E462c6504cFBD52', image: 'https://i.postimg.cc/4NQmwhQK/taylor-swift.webp', description: 'Love Selena Gomez'},
        { key: 'Selena Gomez', value: '0xD722A68D0A1891297ef8E3B086597c0cC83A34Bd', image: 'https://i.postimg.cc/3Rvp5XDY/selena-Gomez.jpg', description: 'Love Selena Gomez'},
        { key: 'Monad Nft 6', value: '0x6364A78A80D3fb3B681A4b75b8dDc38A856531De', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
        { key: 'Monad Nft 3', value: '0x2A75C1EC766435Edc2DBc7B8ECEE0178959d6CB4', image: 'https://i.postimg.cc/Hnx3vJL4/cat.avif', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
        { key: 'Monad Nft 4', value: '0x4099f7b986fFee4F3Ef335d9dD7c348cBDEE7F33', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
        { key: 'Monad Nft 5', value: '0x8F46F32C23643687f46631df00B3a90A6D1748D6', image: 'https://i.postimg.cc/Hnx3vJL4/cat.avif', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
        { key: 'Monad Sexy', value: '0x31B9f3F0268aFD1c6f037f576284bc86f4C0F610', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
        { key: 'Girl Sexy', value: '0x8b326526a82cB44e1911FB2A9f14A8f4711E2206', image: 'https://i.postimg.cc/bv0KKFxy/91.jpg', description: 'Swiper React is available only via NPM as a part of the main Swiper library' },
    ];

const marketplaceContract: Address = '0x351c1c597248B14bac5A7E8a391d712661976E9C';

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
    nftContracts, nftMonaContracts, marketplaceContract, metadataDefault
}

export type { IItemContract };