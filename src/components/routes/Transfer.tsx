import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
} from '../base';
import { useMixpanel } from '../../global-context/mixpanelContext';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Label } from '@radix-ui/react-label';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { walletClientL1, account } from '../../config';
import { custom, parseEther } from 'viem';
import { sepolia } from 'wagmi/chains';

export const Transfer = () => {
  const navigate = useNavigate();

  const { isConnected, address } = useAccount();
  const mixpanel = useMixpanel();
  let didConnect = false;
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isConnected && !didConnect) {
      didConnect = true
      mixpanel.identify(address)
      mixpanel.track('wallet-connect')
    }
  }, [isConnected])

  const handleDeposit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet!');
      return;
    }

    try {
      setStatus('Fetching deposit data...');
      console.log(custom(window.ethereum));

      // Initiate the deposit transaction on the L1.
      const sendTxData = await walletClientL1.sendTransaction({
        account,
        to: tokenAddress as any,
        targetChain: sepolia,
        value: parseEther(amount)
      });

      setStatus(`Send transaction data ready! Use the following data to execute the deposit.`);

      console.log('Sent Transaction Data:', sendTxData);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-[500px]">
      <Card className="p-0 pt-3 space-y-2">
        <CardContent>
          <h1>Bridge Tokens from L1 to L2</h1>
          {isConnected && (
            <>
              <div>
                <Label>
                  Wallet address:
                </Label>
                <Input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0xWalletAddress"
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Label>
                  Amount:
                </Label>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in wei"
                />
              </div>
              <button
                onClick={handleDeposit}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
              {status && (
                <div style={{ marginTop: '20px', color: 'blue' }}>
                  <strong>Status:</strong> {status}
                </div>
              )}
            </>
          )}
          {!isConnected && (<ConnectButton />)}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="secondary" onClick={() => navigate('/')}>Back to home</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
