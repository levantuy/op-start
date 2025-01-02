import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../base';

export type BridgeProps = {
  action: 'deposit' | 'withdrawal'
}

export const Bridge = ({ action }: BridgeProps) => {
  const navigate = useNavigate();

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
            </CardContent>
          </TabsContent>
          <TabsContent value="withdrawal">
            <CardContent className="p-0 pt-3 space-y-2">
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
