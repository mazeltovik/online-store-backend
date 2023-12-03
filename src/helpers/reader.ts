// import { join } from 'path';
// import { open } from 'node:fs/promises';
// import { v4 as uuidv4 } from 'uuid';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   featured: boolean;
//   colors: string[];
//   company: string;
//   description: string;
//   category: string;
//   shipping: boolean;
// };

// async function write() {
//   const path = join(process.cwd(), '/src', 'static', 'store.txt');
//   const file = await open(path);
//   const product: Partial<Product> = {};
//   for await (const line of file.readLines()) {
//     if (!line.includes('[') && !line.includes('{') && !line.includes(']')) {
//       loopLogic(product, line);
//     }
//   }
// }

// // Возвращает массив из аргумента строки, содержит ключ для обьекта и его свойство.
// function handleLine(line: string) {
//   let arr: string[] = [];
//   const pureLine = line.trim().replace(/"/g, '').slice(0, -1);
//   if (pureLine.includes('imageUrl')) {
//     const index = pureLine.indexOf(':');
//     const imgKey = pureLine.slice(0, index);
//     const imgValue = pureLine.slice(index + 1);
//     arr = [imgKey, imgValue];
//   } else {
//     arr = pureLine.split(':');
//   }
//   const [key, value] = arr;
//   return value ? [key, value.trim()] : [key];
// }

// async function createProduct(product: Partial<Product>) {
//   const newProduct: Product = {
//     id: '',
//     name: '',
//     price: 0,
//     imageUrl: '',
//     colors: [],
//     company: '',
//     description: '',
//     category: '',
//     shipping: false,
//     featured: false,
//   };
//   await prisma.products.create({
//     data: Object.assign(newProduct, product),
//   });
// }

// function loopLogic(product: Partial<Product>, line: string) {
//   const keyAndValue = handleLine(line);
//   const [key, value] = keyAndValue;
//   if (key == 'id') {
//     product[key] = uuidv4();
//   } else if (key == 'colors') {
//     const colorsArr = value.split(',');
//     product[key] = colorsArr;
//   } else if (key == 'shipping') {
//     if (value == 'false') {
//       product[key] = false;
//     } else {
//       product[key] = true;
//     }
//   } else if (key == 'featured') {
//     if (value == 'false') {
//       product[key] = false;
//     } else {
//       product[key] = true;
//     }
//   } else if (key == 'price') {
//     product[key] = Number(value);
//   } else if (key == '}') {
//     createProduct(product);
//     product = {};
//   } else {
//     product[key] = value;
//   }
// }

// write();
