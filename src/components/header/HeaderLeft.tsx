import { useNavigate } from "react-router-dom"

export type HeaderLeftProps = {
  logo: string
}

export const HeaderLeft = ({ logo }: HeaderLeftProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex logo">
      <a onClick={() => navigate('/')}><img src={logo} /></a>      
    </div>
  )
}
