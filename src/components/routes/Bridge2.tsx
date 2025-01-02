import { useNavigate } from 'react-router-dom'
import {
  Button,
} from '../base';

export type Bridge2Props = {
  action: 'deposit' | 'withdrawal'
}

export const Bridge2 = ({ action }: Bridge2Props) => {
  const navigate = useNavigate();

  return (<div>
    {action}
    <Button type='button' variant="secondary"
      onClick={() => navigate('/bridge/deposit')}
    >Back to home</Button>
  </div>);
}
