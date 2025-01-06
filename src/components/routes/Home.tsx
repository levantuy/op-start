import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../base';
import { useNavigate } from 'react-router';

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row flex-wrap gap-3">
      <Card className="cursor-pointer" onClick={() => navigate('/playground')}>
        <CardHeader>
          <CardTitle>Send</CardTitle>
          <CardDescription>Test send token use Wagmi & Viem</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer" onClick={() => navigate('/bridge')}>
        <CardHeader>
          <CardTitle>Bridge</CardTitle>
          <CardDescription>Example Bridge Implementation</CardDescription>
        </CardHeader>
      </Card>

      <Card className="cursor-pointer" onClick={() => navigate('/nft-mint')}>
        <CardHeader>
          <CardTitle>Nft</CardTitle>
          <CardDescription>Page mint Nft</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
