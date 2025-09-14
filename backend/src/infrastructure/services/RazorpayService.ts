import Razorpay from "razorpay";

export class RazorpayService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  async createOrder(amount: number, currency = "INR") {
    return await this.razorpay.orders.create({
      amount: amount * 100,
      currency,
    });
  }
}