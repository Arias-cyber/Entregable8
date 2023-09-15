//const fs = require('fs');
import { readFileSync, writeFileSync, existsSync } from 'fs';

export default class ProductManager {
    constructor() {
        this.products = []
        this.path = './products.json'
        this.loadProducts();

    }
    loadProducts() {
        try {
            const data = readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }
    addProduct(title, description, code, price, status = true, stock, category, thumbnail) {
        if (!title || !description || !code || !price || !stock || !category) {
            return 'Todos los campos obligatorios deben ser completados';
        }
        const product = {
            id: this.products.length + 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };
        const codeExists = this.products.some((elemento) => {
            return elemento.code === code;
        });

        if (codeExists) {
            return 'El código ya existe';
        } else {
            this.products.push(product);
            this.saveProducts();
            return 'Producto agregado exitosamente';
        }
    }
    saveProducts() {
        try {
            writeFileSync(this.path, JSON.stringify(this.products));
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }
    getProducts() {
        if (!existsSync(this.path)) {
            try {
                writeFileSync(this.path, JSON.stringify(this.products));
            } catch (err) {
                return "error en la creacion del archivo " + error;
            }
        }
        try {
            const data = readFileSync(this.path, "utf-8");
            const dataArray = JSON.parse(data);

            if (Array.isArray(dataArray)) {
                return dataArray;
            } else if (typeof dataArray === 'object' && dataArray !== null) {
                return [dataArray]; //como es un objeto, lo convertimos en un array
            } else {
                return []; // Si no es un objeto ni un array valido, devolver uno vacío
            }
        } catch (err) {
            return "error en la lectura del archivo " + error;
        }
    };
    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (product) {
          return product
        } else {
          return null;
        }
      }
      updateProduct(id, fieldsToUpdate) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
          const product = this.products[productIndex];
          this.products[productIndex] = { ...product, ...fieldsToUpdate };
          this.saveProducts();
          return 'producto modificado'
        } else {
          return 'Producto no encontrado'
        }
      }
    deleteProduct(id) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
          this.products.splice(productIndex, 1);
          this.saveProducts();
          return 'producto eliminado'
        } else {
          return 'Producto no encontrado'
        }
      }
}

const product = new ProductManager();
