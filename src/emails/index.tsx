// Modified sendPurchaseReceipt.ts
import { Resend } from 'resend'
import { IOrder } from '@/lib/db/models/order.model'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
    // Create HTML email template directly
    const htmlContent = `
    <html>
      <body>
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.totalPrice.toFixed(2)}</p>
        <!-- Add more order details as needed -->
      </body>
    </html>
  `

    await resend.emails.send({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: (order.user as { email: string }).email,
        subject: `Order Confirmation`,
        html: htmlContent,
    })
}