'use client';
import React, { useEffect, useState } from "react";
import IngredienteForm from "./ui/IngredientsForm";

interface Props {
  params: {
    slug: string;
  };
}

export default function IngredientePage({ params }: Props) {
  const { slug } = params;
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${slug}`);
        const data = await response.json();
        if (data.ok) {
          setProductName(data.product.title || '');
        } else {
          console.error('Error al obtener el Producto:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener el Producto:', error);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    console.log("Updated productName:", productName);
  }, [productName]);

  return (
    <IngredienteForm slug={slug} productName={productName} />
  );
}













