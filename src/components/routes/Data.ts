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
	{ key: 'Cz Token', value: '0xEB117ffe3d71987550ebAEA2D9af2650310A1286' },
    ];


export {
    nftContracts
}

export type { IItemContract };