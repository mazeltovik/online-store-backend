import { join } from 'path';
import { open } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import randomInt from './randomInt';

const prisma = new PrismaClient();

type Color = {
  productId: string;
  clr_ff0000: number;
  clr_00ff00: number;
  clr_0000ff: number;
  clr_000: number;
  clr_ffb900: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  totalRating: number;
  availableColors: string[];
  imageUrl: string;
  featured: boolean;
  company: string;
  description: string;
  category: string;
  shipping: boolean;
};

async function write() {
  const path = join(process.cwd(), '/src', 'static', 'store.txt');
  const file = await open(path);
  const product: Partial<Product> = {};
  for await (const line of file.readLines()) {
    if (!line.includes('[') && !line.includes('{') && !line.includes(']')) {
      loopLogic(product, line);
    }
  }
  process.stdout.write(`\x1b[33mCreated Create Database \n`);
  await new Promise((resolve) => {
    setTimeout(() => resolve(next()), 4000);
  });
}

// Возвращает массив из аргумента строки, содержит ключ для обьекта и его свойство.
function handleLine(line: string) {
  let arr: string[] = [];
  const pureLine = line.trim().replace(/"/g, '').slice(0, -1);
  if (pureLine.includes('imageUrl')) {
    const index = pureLine.indexOf(':');
    const imgKey = pureLine.slice(0, index);
    const imgValue = pureLine.slice(index + 1);
    arr = [imgKey, imgValue];
  } else {
    arr = pureLine.split(':');
  }
  const [key, value] = arr;
  return value ? [key, value.trim()] : [key];
}

async function createProduct(product: Partial<Product>) {
  const newProduct: Product = {
    id: '',
    name: '',
    price: 0,
    rating: 5,
    reviews: 0,
    totalRating: 0,
    availableColors: [],
    imageUrl: '',
    company: '',
    description: '',
    category: '',
    shipping: false,
    featured: false,
  };
  await prisma.products.create({
    data: Object.assign(newProduct, product),
  });
}

function loopLogic(product: Partial<Product>, line: string) {
  const keyAndValue = handleLine(line);
  const [key, value] = keyAndValue;
  if (key == 'shipping') {
    if (value == 'false') {
      product[key] = false;
    } else {
      product[key] = true;
    }
  } else if (key == 'featured') {
    if (value == 'false') {
      product[key] = false;
    } else {
      product[key] = true;
    }
  } else if (key == 'availableColors') {
    product[key] = value.split(',').sort();
  } else if (
    key == 'price' ||
    key == 'rating' ||
    key == 'reviews' ||
    key == 'totalRating'
  ) {
    product[key] = Number(value);
  } else if (key == '}') {
    createProduct(product);
    product = {};
  } else {
    product[key] = value;
  }
}

async function writeColors() {
  const path = join(process.cwd(), '/src', 'static', 'colors.txt');
  const file = await open(path);
  const colors: Partial<Color> = {};
  for await (const line of file.readLines()) {
    if (!line.includes('[') && !line.includes('{') && !line.includes(']')) {
      loopColorLogic(colors, line);
    }
  }
  process.stdout.write(`\x1b[33mCreated Create Colors \n`);
  // Promise.resolve(next());
}

function loopColorLogic(colors: Partial<Color>, line: string) {
  const keyAndValue = handleLine(line);
  const [key, value] = keyAndValue;
  if (key.includes('clr')) {
    colors[key] = randomInt(1, 5);
  } else if (key == '}') {
    createColor(colors);
    colors = {};
  } else {
    colors[key] = value;
  }
}

async function createColor(colors: Partial<Color>) {
  const newColor: Color = {
    productId: '',
    clr_ff0000: 0,
    clr_00ff00: 0,
    clr_0000ff: 0,
    clr_000: 0,
    clr_ffb900: 0,
  };
  await prisma.color.create({
    data: Object.assign(newColor, colors),
  });
}

const tasks = [write, writeColors];

function next() {
  const currentTask = tasks.shift();
  if (currentTask) {
    currentTask();
  }
}

next();

// write();
// writeColors();
