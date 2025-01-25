import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './ImageSlider.module.css';

const ImageSlider = ({ item, language }) => {
  const [currentSlide, setCurrentSlide] = useState(1); 

  if (!item.images || item.images.length === 0) {
    return (
      <img
        src="https://cdn-icons-png.flaticon.com/512/1046/1046874.png"
        alt={item.translates.find((t) => t.languageValue === language)?.name || 'No Name'}
        className={styles.itemImage}
      />
    );
  }

  return (
    <div className={styles.sliderContainer}>
      {/* Custom Counter */}
      <div className={styles.slideCounter}>
        {currentSlide}/{item.images.length}
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 seconds
        loop // Infinite loop
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)} // Update current slide
        className={styles.swiperContainer}
      >
        {item.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`http://localhost:3000${image.localPath}`}
              alt={item.translates.find((t) => t.languageValue === language)?.name || 'No Name'}
              className={styles.itemImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;