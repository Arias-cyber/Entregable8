// mocking.js
import { faker } from '@faker-js/faker';

// Ruta para generar productos falsos
const generateProducts=(req,res) =>{
  const numberOfProducts = 100;
  const products = [];

  for (let i = 0; i < numberOfProducts; i++) {
    const product = {
      _id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: `abc${i + 1}`,
      price: faker.number.int({ min: 5, max: 500 }),
      status: true,
      stock: faker.number.int({ min: 0, max: 10000 }),
      // Agrega más propiedades ficticias según tus necesidades
    };
    products.push(product);
  }

  res.json(products);
}

export default generateProducts;
