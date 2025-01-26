import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './ImageSlider.module.css';

const ImageSlider = ({ item, language }) => {
  const [currentSlide, setCurrentSlide] = useState(1); 
  const imageLinks=[
    "https://images.deliveryhero.io/image/fd-th/LH/jb7y-listing.jpg",
    "https://w7.pngwing.com/pngs/319/731/png-transparent-cafe-food-barbecue-grill-chicken-dish-grilled-food-animals-seafood-recipe-thumbnail.png",
    "https://veenaazmanov.com/wp-content/uploads/2017/03/Hyderabad-Chicken-Biryani-Dum-Biryani-Kachi-Biryani4.jpg",
    "https://t3.ftcdn.net/jpg/06/13/11/24/360_F_613112498_iv3eiTNveuJpXjHFGDnClADBmBNGMTVD.jpg",
    "https://www.thespruceeats.com/thmb/9Clboupu2hvMEXks_u3HcNkkNlg=/450x300/filters:no_upscale():max_bytes(150000):strip_icc()/SES-classic-steak-diane-recipe-7503150-hero-01-b33a018d76c24f40a7315efb3b02025c.jpg",
    "https://www.quichentell.com/wp-content/uploads/2020/12/Fish-Pulao-3.1.jpg"
  ]

  const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

  if (!item.images || item.images.length === 0) {
    return (
      <img
        src={randomImage}
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