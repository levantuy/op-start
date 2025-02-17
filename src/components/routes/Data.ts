import { Address } from "abitype";

interface IItemContract { key: string, value: Address };
const nftContracts:  Array<IItemContract> =
    [{ key: 'First', value: "0xc2c84FBdF873468Fd6ae84A01B09F5DF39b5366b" },
    { key: 'Second', value: "0x5414faE0f85B20D644916D872c1990011Ec933d7" }];


export {
    nftContracts
}

export type { IItemContract };