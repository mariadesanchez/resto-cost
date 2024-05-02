'use client'
import Image from 'next/image';
import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width: number;
  height: number;
  img2?: string;
}

export const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
  img2,

}: Props) => {

  // const localSrc = ( src ) 
  // localSrc.startsWith('http') // https://urlcompletodelaimagen.jpg
  //     && src
    //   : `/products/${ src }`
    // : '/imgs/placeholder.jpg';
    const [imagenFuente, setImagenFuente] = useState(src);
  return (
    img2&&
    <Image
    src={imagenFuente}
      width={ width }
      height={ height}
      alt={ alt }
      className={ className }
      style={ style }
      onMouseEnter={() => setImagenFuente(img2)}
      onMouseLeave={() => setImagenFuente(src)}
   
    />
  );
};