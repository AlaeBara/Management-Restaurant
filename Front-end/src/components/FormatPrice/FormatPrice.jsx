export const formatPrice = (price) => {
    // Convert the input to a number if it's a string
    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
  
    // Check if the parsed price is a valid number
    if (typeof parsedPrice !== 'number' || isNaN(parsedPrice)) {
      console.error('formatPrice: Expected a valid number or numeric string, but received:', price);
      return price; // Return the original input as a fallback
    }
  
    // Check if the price is a whole number
    if (parsedPrice % 1 === 0) {
      return `${parseInt(parsedPrice)}`; // Remove .00 for whole numbers
    } else {
      return `${parsedPrice.toFixed(2)}`; // Keep two decimal places for non-whole numbers
    }
};