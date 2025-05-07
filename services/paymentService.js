const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.apiKey = process.env.MIDTRANS_API_KEY;
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.midtrans.com' 
      : 'https://api.sandbox.midtrans.com';
  }
  
  async createTransaction(order) {
    try {
      const payload = {
        transaction_details: {
          order_id: order.invoiceNumber,
          gross_amount: order.totalPrice
        },
        customer_details: {
          first_name: order.user.name.split(' ')[0],
          last_name: order.user.name.split(' ').slice(1).join(' '),
          email: order.user.email,
          phone: order.shippingAddress.phone
        },
        item_details: order.items.map(item => ({
          id: item.product._id,
          price: item.price,
          quantity: item.quantity,
          name: item.name
        }))
      };
      
      const response = await axios.post(
        `${this.baseUrl}/v2/charge`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Payment service error:', error.response ? error.response.data : error.message);
      throw new Error('Gagal membuat transaksi pembayaran');
    }
  }
  
  async getTransactionStatus(orderId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/${orderId}/status`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Payment service error:', error.response ? error.response.data : error.message);
      throw new Error('Gagal mendapatkan status transaksi');
    }
  }
  
  verifyCallback(body, signature) {
    const expectedSignature = crypto
      .createHash('sha512')
      .update(body + this.apiKey)
      .digest('hex');
      
    return expectedSignature === signature;
  }
}

module.exports = new PaymentService();