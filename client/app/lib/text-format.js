export const formatPrice = (price) => {
  const numericPrice = parseFloat(price);

  // Check if the input is a valid number
  if (isNaN(numericPrice)) {
    return "Invalid Price";
  }

  // Use toFixed(2) to round the number to 2 decimal places and convert it to a string
  const formattedPrice = numericPrice.toFixed(2);

  // Replace '.' with ',' to match the desired format
  return formattedPrice.replace(".", ",");
}
