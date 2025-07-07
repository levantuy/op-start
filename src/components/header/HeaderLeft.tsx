import { NavigationMenu } from "radix-ui";
import { CaretDownIcon } from "@radix-ui/react-icons";
import styles from "./HeaderLeft.module.css";
import { useNavigate } from "react-router-dom";

export type HeaderLeftProps = {
  logo: string
}

export const HeaderLeft = ({ logo }: HeaderLeftProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row">
      <div className="flex logo" style={{width: '40px', height: '40px'}}>
        <a onClick={() => navigate('/')}><img src={logo} /></a>
      </div>
      <NavigationMenu.Root className={styles.Root}>
        <NavigationMenu.List className={styles.MenuList}>        
          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={styles.Link}
              onClick={() => navigate('/account-nft')}
            >
              My NFT
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={styles.Link}
              onClick={() => navigate('/minting')}
            >
              Minting
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={styles.Link}
              onClick={() => navigate('/collection')}
            >
              Collection
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={styles.Link}
              onClick={() => navigate('/marketplace/0x')}
            >
              Marketplace
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger className={styles.Trigger}>More
              <CaretDownIcon className={styles.CaretDown} aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className={styles.Content}>
              <NavigationMenu.List>
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className={styles.Link}
                    onClick={() => navigate('/bridge')}
                  >
                    Bridge
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className={styles.Link}
                    onClick={() => navigate('/playground')}
                  >
                    Send
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator className={styles.Indicator}>
            <div className={styles.Arrow} />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <div className={styles.ViewportPosition}>
          <NavigationMenu.Viewport className={styles.Viewport} />
        </div>
      </NavigationMenu.Root>
    </div>
  )
}