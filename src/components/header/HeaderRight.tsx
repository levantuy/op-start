import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { AccountMenu } from '../AccountMenu';
import { ThemeToggle } from '../ThemeToggle';
import { Separator } from '../base';

export const HeaderRight = () => {
  return (
    <div className="account-menu flex flex-row">
      <div className="space-x-3 hidden md:flex">
        <ThemeToggle />
        <Separator orientation="vertical" />
      </div>
      <div className="flex flex-row items-center pl-6">
        <ConnectButton />
        {/* <AccountMenu /> */}
      </div>
    </div>
  )
}
