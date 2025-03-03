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
    [{ key: 'Monad Nft', value: '0xe27Ee4CdDF7794cE36AEAb0Ebff3eDb73A892410' },
    { key: 'Monad Nft1', value: '0xA792a454C5a36af8Cf2b517E3a65b06fd742e662' },
    { key: 'Monad Nft V1', value: '0x385cd0F8fb6A0C25685066D9f2Afe3aEBFc3F8c7' },
    { key: 'Girl Nft', value: '0xaa1059a2475b547F6A6A3612e2889281a5a496f8' },
    ];

export {
    nftContracts, nftMonaContracts
}

export type { IItemContract };