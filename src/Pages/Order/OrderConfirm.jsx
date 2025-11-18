import React from 'react';
import { useLocation } from 'react-router';

const OrderConfirm = () => {
    const location = useLocation();
    const data = location.state?.orderData;
    return(<>
    <div className="mx-[20%] gap-5 my-4">
        <div className="flex gap-24 justify-center">
            <div className="m-3 text-center text-[14px] text-gray-600">
                <h1>Order Number</h1>
                <p className="text-black text-[12px] font-semibold">{data?._id}</p>
            </div>

            <div className="m-3 text-center text-[14px] text-gray-600">
                <h1>Date</h1>
                
                <p className="text-black text-[12px] font-semibold">{new Date(data.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="m-3 text-center text-[14px] text-gray-600">
                <h1>Total</h1>
                <p className="text-black text-[12px] font-semibold">{data.totalPrice.toLocaleString('en-LK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
            </div>

            <div className="m-3 text-center text-[14px] text-gray-600">
                <h1>Payment Method</h1>
                <p className="text-black text-[12px] font-semibold">{data.paymentMethod}</p>
            </div>
        </div>

        <div className="my-4 text-sm text-gray-800">
            <p>Please WhatsApp us 0712605145 to confirm the order and get the Bank Information</p>
        </div>

        <div className="my-4 py-3">
            <h1 className="text-xl font-bold mb-4">Order Details</h1>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-medium border-b-2 border-gray-100">
                        <tr>
                            <th scope="col" className="py-3 text-left font-medium">
                                PRODUCT
                            </th>
                            {/* FIXED: Removed 'px-6', added 'py-3' to match height, kept 'text-right' */}
                            <th scope="col" className="py-3 text-right font-medium">
                                TOTAL
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.orderItems.map((item) => (<tr className="bg-neutral-primary border-b border-gray-100">
                            <td className="py-4 text-left font-medium text-heading whitespace-nowrap">
                                {item.name}
                            </td>
                            <td className="text-right py-4">
                                {(item.quantity * item.price).toLocaleString('en-LK', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </td>
                        </tr>))}

                        {/* <tr className="bg-neutral-primary border-b border-gray-100">
                            <td className="py-4 text-left font-medium text-heading whitespace-nowrap">
                                Subtotal:
                            </td>
                            <td className="text-right py-4">
                                {}{data.totalPrice.toLocaleString('en-LK', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </td>
                        </tr> */}

                        <tr className="bg-neutral-primary border-b border-gray-100">
                            <td className="py-4 text-left font-medium text-heading whitespace-nowrap">
                                Shipping:
                            </td>
                            <td className="text-right py-4">
                                Courier charge may vary
                            </td>
                        </tr>

                        <tr className="bg-neutral-primary border-b border-gray-100">
                            <td className="py-4 text-left font-medium text-heading whitespace-nowrap">
                                Total:
                            </td>
                            <td className="text-right py-4">
                                {data.totalPrice.toLocaleString('en-LK', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </td>
                        </tr>

                        <tr className="bg-neutral-primary">
                            <td className="py-4 text-left font-medium text-heading whitespace-nowrap">
                                Payment method:
                            </td>
                            <td className="text-right py-4">
                                {data.paymentMethod}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex gap-[25%] my-8">
                <div>
                    <h1 className="text-lg font-bold my-2">Billing Address</h1>
                    <div className="text-sm text-gray-800">
                        <p>{data.billingAddress.firstName} {data.billingAddress.lastName}</p>
                        <p>{data.billingAddress.apartment}</p>
                        <p>{data.billingAddress.companyName}</p>
                        <p>{data.billingAddress.city}</p>
                        <p>{data.billingAddress.country}</p>
                        <p>Phone: {data.billingAddress.phone}</p>
                        <p>Email: {data.billingAddress.email}</p>
                    </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold my-2">Shipping Address</h1>
                    <div className="text-sm text-gray-800">
                        <p>{data.shippingAddress.firstName} {data.shippingAddress.lastName}</p>
                        <p>{data.shippingAddress.apartment}</p>
                        <p>{data.shippingAddress.companyName}</p>
                        <p>{data.shippingAddress.city}</p>
                        <p>{data.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
    </>)
}

export default OrderConfirm;