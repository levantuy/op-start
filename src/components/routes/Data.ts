import { Address } from "abitype";

interface IItemContract { key: string, value: Address };
const nftContracts: Array<IItemContract> =
    [{ key: 'Nice Token', value: "0xc2c84FBdF873468Fd6ae84A01B09F5DF39b5366b" },
    { key: 'Block Timestamp', value: "0x5414faE0f85B20D644916D872c1990011Ec933d7" },
    { key: 'Thuan Capital', value: '0xfB452D2e0E60fc990EC1dD0018b522FCAbdfF23B' },
    { key: 'Mug Token', value: '0x17018B76BB88C62Ef468a5323aE4Ffd775C1f9C3' },
    { key: 'Smart Contract Token', value: '0x2FE4E18eA571EA3b8bd9d1dAC6F3779a549A0f9F' },
    { key: 'Just Like It', value: '0x2073C3260A5537CE9f3bb0292E49E6146d1405A9' },
    { key: 'Keep Building', value: '0x984F27D333F066bbe1e08791D0f053ae9EA76392' },
    { key: 'Cz Token', value: '0xEB117ffe3d71987550ebAEA2D9af2650310A1286' }];

const nftMonaContracts: Array<IItemContract> =
    [
        { key: 'Monad Nft 3', value: '0x2A75C1EC766435Edc2DBc7B8ECEE0178959d6CB4' },
        { key: 'Monad Nft 4', value: '0x4099f7b986fFee4F3Ef335d9dD7c348cBDEE7F33' },
        { key: 'Monad Nft 5', value: '0x8F46F32C23643687f46631df00B3a90A6D1748D6' },
        { key: 'Monad Sexy', value: '0x31B9f3F0268aFD1c6f037f576284bc86f4C0F610' },
        { key: 'Girl Sexy', value: '0x8b326526a82cB44e1911FB2A9f14A8f4711E2206' },
    ];

const marketplaceContract: Address = '0x351c1c597248B14bac5A7E8a391d712661976E9C';

const metadataDefault = {
    "name": "Girl NFT",
    "tokenId": 1,
    "image": "https://red-electrical-herring-642.mypinata.cloud/ipfs/bafybeihbplnzglpr572ucbcbvdz3xmkgxhkilin2whohkvd5rxoc6bzudi/1.jpg",
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