export const formatPrice = (price) => {
  const numericPrice = parseFloat(price);

  // Check if the input is a valid number
  if (isNaN(numericPrice)) {
    console.error("Invalid value provided")
    return "N/A";
  }

  // Use toFixed(2) to round the number to 2 decimal places and convert it to a string
  return numericPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

}

export function validateProductName(value) {
  return value.trim().length >= 3;
}

export function validatePrice(value) {
  const price = parseFloat(value);
  return !isNaN(price) && price >= 0;
}

export function validateStorage(value) {
  const stock = parseInt(value);
  return !isNaN(stock) && stock >= 0;
}