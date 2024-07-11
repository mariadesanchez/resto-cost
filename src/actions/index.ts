

export {deleteUserAddress}from './address/delete-user-address';
export {getUserAddress}from './address/get-user-address';
export {setUserAddress}from './address/set-user-address';


export {login,authenticate} from './auth/login';
export  {logout} from './auth/logout';
export {registerUser} from './auth/register';

export {getCategories} from './category/get-categories';
export {getCategoryByid} from './category/get-category-by-id';
export {createUpdateCategory} from './category/create-update-category';
export {getCategoryByName} from './category/get-category-by-name'

export {getCountries} from './country/get-countries';

export {placeOrder} from './order/place-order';
export {getOrderById} from './order/get-order-by-id';
export {deleteOrderById} from './order/delete-order-by-id';
export {getPaginatedOrders} from './order/get-paginated-orders';
export {getOrdersByUser} from './order/get-orders-by-user';

export {setTransactionId} from './payments/set-transaction-id';
export {paypalCheckPayment} from './payments/paypal-check-payment';
export {mercadoPagoCheckPayment} from './payments/mercado-pago-payment';


export {deleteProductImage} from './product/delete-product-image';
export {createUpdateProduct} from './product/create-update-product';
export {getProductBySlug} from './product/get-product-by-slug';
export {getStockBySlug} from './product/get-stock-by-slug';
export {getPaginatedProductsWithImages} from './product/product-pagination';
export {getProductById} from './product/get-product-by-id';
export {updateProductPrice} from './product/update-price-product'



export {changeUserRole} from './user/change-user-role';
export {getPaginatedUsers} from './user/get-paginater-users';

export {createUpdateIngrediente} from './ingrediente/create-update-ingrediente';
export {getIngredienteBySlug} from './ingrediente/get-ingrediente-by-slug';
export {getIngredientsByProductId} from './ingrediente/get-ingredients-by-productId';
export {deleteIngredienteById} from './ingrediente/delete-ingrediente-by-id';
export {getPricesWithMermaByProductId} from './ingrediente/get-total-price-by-productId'
export {updateIngredientesByMerma} from './ingrediente/update-ingredientes-by-merma'
export {createUpdateMerma} from './precios/create-update-precios-mermas'
export {getMermaById} from './precios/get-precio-merma-by-id'
export {getMermas} from './precios/get-precios-mermas'
export {deleteMermaById} from './precios/detelete-merma'
export {getProductsByCategory} from './product/get-products-by-category'
export {getMermaByName} from './precios/get-precio-merma-by-name'
export {updateMermaPrice} from './precios/update-merma-price'