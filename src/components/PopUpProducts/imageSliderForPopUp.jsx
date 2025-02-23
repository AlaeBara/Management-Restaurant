import React, { useState, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './imageSliderForPopUp.module.css';
import NoImage from '../../assests/thumbnail.jpg';

const ImageSlider = memo(({ item}) => {
  const [currentSlide, setCurrentSlide] = useState(1); 
 
  if (!item.images || item.images.length === 0) {
    return (
      <img
        src={NoImage}
        className={styles.itemImage} loading='lazy'
      />
    );
  }

  return (
    <div className={styles.sliderContainer}>
      {item.images.length >= 2 && 
        <div className={styles.slideCounter}>
          {currentSlide}/{item.images.length}
        </div>
      }
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={item.images.length >= 2}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
        className={styles.swiperContainer}
      >
        {item.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`http://localhost:3000${image.localPath}`}
              className={styles.itemImage} loading='lazy'
            />
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
});

export default ImageSlider;