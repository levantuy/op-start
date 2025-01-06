import { useAccount, useDisconnect } from 'wagmi'
import { useCallback } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Separator,
} from './base';
import { AccountAvatar } from './AccountAvatar'
import { shortenAddress } from '../lib/address';

export const AccountMenu = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const onDisconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return address ? (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12">
            <span>
              <AccountAvatar />
            </span>
            <span className="ml-2 hidden md:inline">
              {shortenAddress(address)}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Account Info</DialogHeader>
          <div className="account-info-wrapper flex flex-col items-center justify-center w-full">
            <AccountAvatar className="h-32 w-32" />
            <span className="text-lg my-4">{address}</span>
            <Separator />
            <Button
              variant="ghost"
              className="w-full mt-4 py-6 text-base"
              onClick={onDisconnectWallet}
            >
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <ConnectButton />
  )
}
