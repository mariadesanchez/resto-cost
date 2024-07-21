import prisma from '../lib/prisma';
import { initialData } from './seed';
// import { countries } from './seed-countries';
import { mermas } from './seed-mermas';

async function main() {
  // 1. Borrar registros previos
  // await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  // await prisma.country.deleteMany();

  // Eliminar primero las relaciones de ProductIngrediente
  await prisma.productIngrediente.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.ingrediente.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users, ingredientes } = initialData;

  // Crear usuarios
  await prisma.user.createMany({
    data: users,
  });

  // Crear países
  // await prisma.country.createMany({
  //   data: countries,
  // });

  // Crear mermas
  await prisma.merma.createMany({
    data: mermas,
  });

  // Crear categorías
  const categoriesData = categories.map((name) => ({ name }));
  await prisma.category.createMany({
    data: categoriesData,
  });

  // Obtener las categorías desde la base de datos
  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  // Crear productos y sus imágenes
  for (const product of products) {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Crear imágenes
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));
    await prisma.productImage.createMany({
      data: imagesData,
    });
  }

  // Crear ingredientes y asociarlos con productos
  for (const ingrediente of ingredientes) {
    const {
      name,
      slug,
      cantidadReceta,
      unidadMedida,
      cantidadConMerma,
      precioConMerma,
      productId,
    } = ingrediente;

    // Crear ingrediente
    const dbIngrediente = await prisma.ingrediente.create({
      data: {
        name,
        slug,
        cantidadReceta,
        unidadMedida,
        cantidadConMerma,
        precioConMerma,
      },
    });

    // Asociar ingrediente con producto
    await prisma.productIngrediente.create({
      data: {
        productId,
        ingredienteId: dbIngrediente.id,
      },
    });
  }

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

