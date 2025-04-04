import { IOrderInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IOrder extends Document, IOrderInput {
    _id: string; // Add this
    isPaid: boolean;
    paidAt: Date;
    totalPrice: number;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    user: {
        name: string;
        email: string;
    };
    shippingAddress: {
        fullName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
        province: string;
    };
    items: Array<{
        clientId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        product: string;
        slug: string;
        category: string;
        countInStock: number;
    }>;
    paymentMethod: string;
    paymentResult: { id: string, status: string, email_address: string, pricePaid: string};
    expectedDeliveryDate: Date;
    isDelivered: boolean;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                clientId: { type: String, required: true },
                name: { type: String, required: true },
                slug: { type: String, required: true },
                image: { type: String, required: true },
                category: { type: String, required: true },
                price: { type: Number, required: true },
                countInStock: { type: Number, required: true },
                quantity: { type: Number, required: true },
                size: { type: String },
                color: { type: String },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            province: { type: String, required: true },
            phone: { type: String, required: true },
        },
        expectedDeliveryDate: { type: Date, required: true },
        paymentMethod: { type: String, required: true },
        paymentResult: { id: String, status: String, email_address: String, pricePaid: String},
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
)

const Order =
    (models.Order as Model<IOrder>) || model<IOrder>('Order', orderSchema)

export default Order