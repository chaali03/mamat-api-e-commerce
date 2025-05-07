/**
 * Utility functions for order processing
 */

/**
 * Generate a unique order ID
 * @returns {string} Unique order ID
 */
exports.generateOrderId = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${randomNum}`;
};

/**
 * Calculate order total with discounts, shipping, and tax
 * @param {Array} items - Order items
 * @param {number} shippingCost - Shipping cost
 * @param {number} taxRate - Tax rate (decimal)
 * @returns {Object} Order totals
 */
exports.calculateOrderTotal = (items, shippingCost = 0, taxRate = 0.11) => {
  // Calculate items price with discounts
  const itemsPrice = items.reduce((acc, item) => {
    const discountedPrice = item.discountPercentage 
      ? item.price * (1 - item.discountPercentage / 100) 
      : item.price;
    return acc + discountedPrice * item.quantity;
  }, 0);
  
  // Calculate tax
  const taxPrice = itemsPrice * taxRate;
  
  // Calculate total
  const totalPrice = itemsPrice + shippingCost + taxPrice;
  
  return {
    itemsPrice,
    shippingCost,
    taxPrice,
    totalPrice
  };
};

/**
 * Calculate shipping cost based on weight and shipping method
 * @param {number} totalWeight - Total weight in grams
 * @param {string} shippingMethod - Shipping method (regular/express)
 * @returns {number} Shipping cost
 */
exports.calculateShippingCost = (totalWeight, shippingMethod) => {
  let shippingCost = 0;
  
  if (shippingMethod === 'regular') {
    shippingCost = totalWeight < 1000 ? 10000 : Math.ceil(totalWeight / 1000) * 10000;
  } else if (shippingMethod === 'express') {
    shippingCost = totalWeight < 1000 ? 20000 : Math.ceil(totalWeight / 1000) * 20000;
  }
  
  return shippingCost;
};

/**
 * Validate shipping address
 * @param {Object} address - Shipping address object
 * @returns {boolean} Is address valid
 */
exports.validateShippingAddress = (address) => {
  const requiredFields = ['street', 'city', 'postalCode', 'country'];
  return requiredFields.every(field => address[field] && address[field].trim() !== '');
};

/**
 * Format order for email
 * @param {Object} order - Order object
 * @returns {Object} Formatted order for email
 */
exports.formatOrderForEmail = (order) => {
  return {
    orderId: order.orderId,
    date: new Date(order.createdAt).toLocaleDateString('id-ID'),
    items: order.orderItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    subtotal: order.itemsPrice,
    shipping: order.shippingPrice,
    tax: order.taxPrice,
    total: order.totalPrice,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod
  };
};