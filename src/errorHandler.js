const PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND';
const INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK';
const MISSING_FIELDS = 'MISISNG FIELDS'
// Crea un diccionario de errores
const errorMessages = {
  [PRODUCT_NOT_FOUND]: 'El producto no se encontró.',
  [INSUFFICIENT_STOCK]: 'Stock insuficiente para el producto.',
  [MISSING_FIELDS]:'Faltan campos',
};

// Función para generar errores personalizados
function createError(errorCode, details = {}) {
  const message = errorMessages[errorCode] ;
  return {
    code: errorCode,
    message,
    ...details,
  };
}

export { createError, PRODUCT_NOT_FOUND, INSUFFICIENT_STOCK,MISSING_FIELDS };