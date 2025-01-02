import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../base';
import { useNavigate } from 'react-router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { optimismSepolia } from 'wagmi/chains';
import { account, walletClientL1 } from '../../config';
import { useMixpanel } from '../../global-context/mixpanelContext';

export const Home = () => {
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
    <div className="flex flex-row flex-wrap gap-3">
      <Card className="cursor-pointer" onClick={() => navigate('/bridge')}>
        <CardHeader>
          <CardTitle>Bridge</CardTitle>
          <CardDescription><div style={{ fontFamily: 'Arial', padding: '20px' }}>
            <h1>Bridge Tokens from L1 to L2</h1>
            {isConnected && (
              <>
                <div>
                  <label>
                    Token Address (L1):
                    <input
                      type="text"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="0xTokenAddress"
                      style={{ marginLeft: '10px', width: '300px' }}
                    />
                  </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label>
                    Amount (in wei):
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount in wei"
                      style={{ marginLeft: '10px', width: '300px' }}
                    />
                  </label>
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
          </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
