import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../base';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { optimismSepolia } from 'wagmi/chains';
import { account, walletClientL1 } from '../../config';
import { useMixpanel } from '../../global-context/mixpanelContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Label } from '@radix-ui/react-label';

export type BridgeProps = {
  action: 'deposit' | 'withdrawal'
}

export const Bridge = ({ action }: BridgeProps) => {
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

      // Initiate the deposit transaction on the L1.
      const depositTxData = await walletClientL1.depositTransaction({
        account,
        request: {
          gas: 21_000n,
          mint: parseEther(amount),
          to: account,
        },
        targetChain: optimismSepolia,
      });

      setStatus(`Deposit transaction data ready! Use the following data to execute the deposit.`);

      console.log('Deposit Transaction Data:', depositTxData);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="pt-6">
      <CardContent>
        <Tabs defaultValue={action} className="w-[500px]">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger
              value="deposit"
              onClick={() => navigate('/bridge/deposit')}
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              onClick={() => navigate('/bridge/withdraw')}
            >
              Withdrawal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <CardContent className="p-0 pt-3 space-y-2">
              <h1>Bridge Tokens from L1 to L2</h1>
              {isConnected && (
                <>
                  <div>
                    <Label>
                      Token Address (L1):
                    </Label>
                    <Input
                      type="text"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="0xTokenAddress"
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
                    Deposit Tokens
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
          </TabsContent>
          <TabsContent value="withdrawal">
            <CardContent className="p-0 pt-3 space-y-2">
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => navigate('/')}>Back to home</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
