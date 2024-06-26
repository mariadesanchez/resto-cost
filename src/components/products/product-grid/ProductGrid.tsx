import { Product } from '@/interfaces';
import { ProductGridItem } from './ProductGridItem';
import { titleFont } from '@/config/fonts';

interface Props {
  products: Product[];
}


export const ProductGrid = ( { products }: Props ) => {
  return (
    <div  className={`${titleFont.className} grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10 ml-3 mr-3`}>
      {
        products.map( product => (
          <ProductGridItem
            key={ product.slug }
            product={ product }
          />
        ) )
      }

    </div>
  );
};