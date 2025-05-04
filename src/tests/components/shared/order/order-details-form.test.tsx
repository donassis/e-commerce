import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsForm from '@/components/shared/order/order-details-form';
import { IOrder } from '@/lib/db/models/order.model';

// Mock components
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

jest.mock('@/components/ui/badge', () => ({
    __esModule: true,
    Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
        <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
    ),
}));

jest.mock('@/components/ui/card', () => ({
    __esModule: true,
    Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="card-content">{children}</div>
    ),
}));

jest.mock('@/components/ui/table', () => ({
    __esModule: true,
    Table: ({ children }: { children: React.ReactNode }) => <table data-testid="table">{children}</table>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
    TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

jest.mock('@/components/shared/product/product-price', () => ({
    __esModule: true,
    default: ({ price }: { price: number }) => <span data-testid="product-price">${price}</span>,
}));

jest.mock('@/lib/utils', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
    formatDateTime: (date: Date) => ({
        dateTime: date.toISOString(),
    }),
}));

jest.mock('@/components/ui/button', () => ({
    __esModule: true,
    buttonVariants: () => 'button-class',
}));

describe('OrderDetailsForm', () => {
    const mockOrder: IOrder = {
        _id: 'order-123',
        shippingAddress: {
            fullName: 'John Doe',
            phone: '123-456-7890',
            street: '123 Main St',
            city: 'New York',
            province: 'NY',
            postalCode: '10001',
            country: 'USA',
        },
        items: [
            {
                slug: 'product-1',
                name: 'Product 1',
                image: '/product1.jpg',
                quantity: 2,
                price: 19.99,
                clientId: '',
                product: '',
                category: '',
                countInStock: 0
            },
            {
                slug: 'product-2',
                name: 'Product 2',
                image: '/product2.jpg',
                quantity: 1,
                price: 29.99,
                clientId: '',
                product: '',
                category: '',
                countInStock: 0
            },
        ],
        itemsPrice: 69.97,
        taxPrice: 6.99,
        shippingPrice: 5.99,
        totalPrice: 82.95,
        paymentMethod: 'Credit Card',
        isPaid: true,
        paidAt: new Date('2023-01-01'),
        isDelivered: false,
        expectedDeliveryDate: new Date('2023-01-10'),
    } as unknown as IOrder;

    it('renders shipping address correctly', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        expect(screen.getByText('Shipping Address')).toBeInTheDocument();
        expect(screen.getByText('John Doe 123-456-7890')).toBeInTheDocument();
        expect(
            screen.getByText('123 Main St, New York, NY, 10001, USA')
        ).toBeInTheDocument();
    });

    it('shows delivery status correctly', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        const notDeliveredBadge = screen.getByText('Not delivered');
        expect(notDeliveredBadge).toBeInTheDocument();
        expect(notDeliveredBadge.closest('[data-testid="badge"]')).toHaveAttribute(
            'data-variant',
            'destructive'
        );

        expect(
            screen.getByText(`Expected delivery at ${mockOrder.expectedDeliveryDate!.toISOString()}`)
        ).toBeInTheDocument();
    });

    it('renders payment method correctly', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        expect(screen.getByText('Payment Method')).toBeInTheDocument();
        expect(screen.getByText('Credit Card')).toBeInTheDocument();

        const paidBadge = screen.getByText(`Paid at ${mockOrder.paidAt!.toISOString()}`);
        expect(paidBadge).toBeInTheDocument();
        expect(paidBadge.closest('[data-testid="badge"]')).not.toHaveAttribute('data-variant');
    });

    it('renders order items table correctly', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        expect(screen.getByText('Order Items')).toBeInTheDocument();

        // Verify table headers
        expect(screen.getByText('Item')).toBeInTheDocument();
        expect(screen.getByText('Quantity')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();

        // Verify product 1
        const product1Link = screen.getByText('Product 1').closest('a');
        expect(product1Link).toHaveAttribute('href', '/product/product-1');
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('$19.99')).toBeInTheDocument();

        // Verify product 2
        const product2Link = screen.getByText('Product 2').closest('a');
        expect(product2Link).toHaveAttribute('href', '/product/product-2');
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('renders order summary correctly', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        expect(screen.getByText('Order Summary')).toBeInTheDocument();

        expect(screen.getByText('Items')).toBeInTheDocument();
        expect(screen.getByText('$69.97')).toBeInTheDocument();

        expect(screen.getByText('Tax')).toBeInTheDocument();
        expect(screen.getByText('$6.99')).toBeInTheDocument();

        expect(screen.getByText('Shipping')).toBeInTheDocument();
        expect(screen.getByText('$5.99')).toBeInTheDocument();

        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('$82.95')).toBeInTheDocument();
    });

    it('does not show pay button when order is already paid', () => {
        render(<OrderDetailsForm order={mockOrder} isAdmin={false} />);

        expect(screen.queryByText('Pay Order')).not.toBeInTheDocument();
    });

});