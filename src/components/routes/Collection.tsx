import "./Collection.css";
import styles from "./NftMint.module.css";
import { nftMonaContracts as slides } from "./Data.ts";
import { AspectRatio } from "radix-ui";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from "../base/index.tsx";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

export const Collection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex flex-row">
        <Swiper
          loop
          navigation={true}
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          pagination={{
            type: 'fraction', clickable: true
          }}
          scrollbar={{ draggable: true }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={styles.backgroundItem}>
              <AspectRatio.Root ratio={16 / 9} className="rounded-lg overflow-hidden shadow-lg">
                <img src={slide.image} alt={slide.key} className="object-cover w-full h-full" />
              </AspectRatio.Root>
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-semibold">{slide.key}</h2>
                <p className="text-gray-600 mt-2">{slide.description}</p>
                <Button onClick={() => navigate('/marketplace')} className={styles.buttonAction}>Open Collection</Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex flex-row" style={{ paddingBottom: '10px', paddingTop: '20px' }}>
        <h2 className="text-5xl font-semibold">Hot Collections</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={styles.backgroundItem}
            style={{ padding: '10px' }}
          >
            <AspectRatio.Root ratio={12 / 9} className="rounded-lg overflow-hidden shadow-lg">
              <img src={slide.image} alt={slide.key} className="object-cover w-full h-full" />
            </AspectRatio.Root>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-semibold">{slide.key}</h2>
              <p className="text-gray-600 mt-2">{slide.description}</p>
              <Button onClick={() => navigate('/marketplace/' + slide.value)} className={styles.buttonAction}>Open Collection</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
