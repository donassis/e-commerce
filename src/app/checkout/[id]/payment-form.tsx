'use client'

import {PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer} from "@paypal/react-paypal-js";

import {Card, CardContent} from '@/components/ui/card'
import {useToast} from "@/hooks/use-toast";
import {approvePayPalOrder, createPayPalOrder} from "@/lib/actions/order.action";
import {IOrder} from "@/lib/db/models/order.model";
import {formatDateTime} from '@/lib/utils'

import CheckoutFooter from "@/app/checkout/checkout-footer";
import {redirect, useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import {loadStripe} from "@stripe/stripe-js";
import StripeForm from "@/app/checkout/[id]/stripe-form";
import {Elements} from "@stripe/react-stripe-js";

export default function OrderDetailsForm({order, paypalClientId, clientSecret}: {
    order: IOrder,
    paypalClientId: string,
    isAdmin: boolean,
    clientSecret: string | null
}) {
    const router = useRouter()
    const {
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        expectedDeliveryDate,
        isPaid,
    } = order
    const {toast} = useToast()
    if (isPaid) {
        redirect((`/account/orders/${order._id}`))
    }

    function PrintLoadingState() {
        const [{isPending, isRejected}] = usePayPalScriptReducer()
        let status = ''
        if (isPending) {
            status = 'Loading PayPal...'
        } else if (isRejected) {
            status = 'Error in loading PayPal.'
        }
        return status
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order._id)
        if (!res.success)
            return toast({
                description: res.message,
                variant: 'destructive'
            })
        return res.data
    }
    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrder(order._id, data)
        toast({
            description: res.message,
            variant: res.success ? 'default' : 'destructive',
        })
    }

    const CheckoutSummary = () => (
        <Card>
            <CardContent className='p-4'>
                {/*{!isAddressSelected && (*/}
                {/*    <div className='border-b mb-4'>*/}
                {/*        <Button*/}
                {/*            className='rounded-full w-full'*/}
                {/*            onClick={handleSelectShippingAddress}*/}
                {/*        >*/}
                {/*            Ship to this address*/}
                {/*        </Button>*/}
                {/*        <p className='text-xs text-center py-2'>*/}
                {/*            Choose a shipping address and payment method in order to calculate*/}
                {/*            shipping, handling, and tax.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*{isAddressSelected && !isPaymentMethodSelected && (*/}
                {/*    <div className=' mb-4'>*/}
                {/*        <Button*/}
                {/*            className='rounded-full w-full'*/}
                {/*            onClick={handleSelectPaymentMethod}*/}
                {/*        >*/}
                {/*            Use this payment method*/}
                {/*        </Button>*/}

                {/*        <p className='text-xs text-center py-2'>*/}
                {/*            Choose a payment method to continue checking out. You&apos;ll*/}
                {/*            still have a chance to review and edit your order before it&apos;s*/}
                {/*            final.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*{isPaymentMethodSelected && isAddressSelected && (*/}
                {/*    <div>*/}
                {/*        <Button onClick={handlePlaceOrder} className='rounded-full w-full'>*/}
                {/*            Place Your Order*/}
                {/*        </Button>*/}
                {/*        <p className='text-xs text-center py-2'>*/}
                {/*            By placing your order, you agree to {site.name}&apos;s{' '}*/}
                {/*            <Link href='/page/privacy-policy'>privacy notice</Link> and*/}
                {/*            <Link href='/page/conditions-of-use'> conditions of use</Link>.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}

                <div>
                    <div className='text-lg font-bold'>Order Summary</div>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span>Items:</span>
                            <span>
                <ProductPrice price={itemsPrice} plain/>
              </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Shipping & Handling:</span>
                            <span>
                {shippingPrice === undefined ? (
                    '--'
                ) : shippingPrice === 0 ? (
                    'FREE'
                ) : (
                    <ProductPrice price={shippingPrice} plain/>
                )}
              </span>
                        </div>
                        <div className='flex justify-between'>
                            <span> Tax:</span>
                            <span>
                {taxPrice === undefined ? (
                    '--'
                ) : (
                    <ProductPrice price={taxPrice} plain/>
                )}
              </span>
                        </div>
                        <div className='flex justify-between  pt-4 font-bold text-lg'>
                            <span> Order Total:</span>
                            <span>
                <ProductPrice price={totalPrice} plain/>
              </span>
                        </div>
                        {isPaid && paymentMethod === 'PayPal' && (
                            <div>
                                <PayPalScriptProvider options={{clientId: paypalClientId}}>
                                    <PrintLoadingState/>
                                    <PayPalButtons
                                        createOrder={handleCreatePayPalOrder}
                                        onApprove={handleApprovePayPalOrder}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}

                        {!isPaid && paymentMethod === 'Stripe' && clientSecret && (
                            <Elements
                                options={{
                                    clientSecret,
                                }}
                                stripe={stripePromise}
                            >
                                <StripeForm
                                    priceInCents={Math.round(order.totalPrice * 100)}
                                    orderId={order._id}
                                />
                            </Elements>
                        )}

                        {!isPaid && paymentMethod === 'Cash On Delivery' && (
                            <Button
                                className='w-full rounded-full'
                                onClick={() => router.push(`/account/orders/${order._id}`)}
                            >
                                View Order
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

    return (
        <main className='max-w-6xl mx-auto'>
            <div className='grid md:grid-cols-4 gap-6'>
                <div className='md:col-span-3'>
                    {/* Shipping Address */}
                    <div>
                        <div className='grid grid-cols-1 md:grid-cols-12 my-3 pb-3'>
                            <div className='col-span-5 flex text-lg font-bold'>
                                <span>Shipping Address</span>
                            </div>
                            <div className='col-span-5'>
                                <p>
                                    {shippingAddress.fullName} <br/>
                                    {shippingAddress.street} <br/>
                                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className='border-y'>
                        <div className='grid grid-cols-1 md:grid-cols-12 my-3 pb-3'>
                            <div className='flex text-lg font-bold col-span-5'>
                                <span className='w-8'>2 </span>
                                <span>Payment Method</span>
                            </div>
                            <div className='col-span-5'>
                                <p>{paymentMethod}</p>
                            </div>
                        </div>

                        {/* Items and Delivery Date */}
                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-12 my-3 pb-3'>
                                <div className='flex text-lg font-bold col-span-5'>
                                    <span>Items and Shipping</span>
                                </div>
                                <div className='col-span-5'>
                                    <p>
                                        Delivery Date:{' '}
                                        {formatDateTime(expectedDeliveryDate).dateOnly}
                                    </p>
                                    <ul>
                                        {items.map((item, index) => (
                                            <li key={index}>
                                                {item.name} x {item.quantity} = {item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Mobile Checkout Summary */}
                            <div className='block md:hidden'>
                                <CheckoutSummary/>
                            </div>

                            {/* Checkout Footer */}
                            <CheckoutFooter/>
                        </div>

                        {/* Desktop Checkout Summary */}
                        <div className='hidden md:block'>
                            <CheckoutSummary/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
