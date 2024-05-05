'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './slideshow.css';
import Image from 'next/image';



interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: '90vw',
          height: '300px',
          borderRadius: '10px', // Ajusta el valor según el radio que desees
          overflow: 'hidden', 
        
        }}
        pagination
        autoplay={{
          delay: 2500
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {
            images.map( image => (
              <SwiperSlide key={ image }>
                  <div style={{ margin: '1px' }}> {/* Agregando márgenes pequeños */}
                  <Image
                    width={ 250 } // Tamaño más pequeño para las imágenes
                    height={ 180 } // Tamaño más pequeño para las imágenes
                    src={ image  }
                    alt={ title }
                    className="object-fill"
                  />
                </div>
              </SwiperSlide>
  
            ) )
        }
      </Swiper>
    </div>
  );
};
