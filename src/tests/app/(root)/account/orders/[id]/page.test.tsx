
import OrderDetailsPage from '@/app/(root)/account/orders/[id]/page';
import { render, screen } from '@testing-library/react';

import { auth } from '@/auth';
import { getOrderById } from '@/lib/actions/order.action';
import { formatId } from '@/lib/utils';

// Mock dependencies
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

jest.mock('@/auth', () => ({
    auth: jest.fn(),
}));

jest.mock('@/lib/actions/order.action', () => ({
    getOrderById: jest.fn(),
}));

jest.mock('@/components/shared/order/order-details-form', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: ({ order, isAdmin }: { order: any; isAdmin: boolean }) => (
        <div data-testid="order-details-form">
            {JSON.stringify({ order, isAdmin })}
        </div>
    ),
}));

jest.mock('@/lib/utils', () => ({
    formatId: jest.fn((id) => `FORMATTED_${id}`),
}));

describe('OrderDetailsPage', () => {
    const mockOrder = {
        _id: 'order123',
        items: [],
        totalPrice: 100,
        // ... other order properties
    };

    const mockProps = {
        params: Promise.resolve({ id: 'order123' }),
        searchParams: Promise.resolve({ page: '1' }), // Now a Promise
    };

    beforeEach(() => {
        (getOrderById as jest.Mock).mockResolvedValue(mockOrder);
        (auth as jest.Mock).mockResolvedValue({
            user: {
                role: 'User',
            },
        });
        (formatId as jest.Mock).mockImplementation((id) => `FORMATTED_${id}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the order details page correctly', async () => {
        // We need to await the component since it's async
        const Component = await OrderDetailsPage(mockProps);
        render(Component);

        // Verify breadcrumb navigation
        expect(screen.getByText('Your Account')).toBeInTheDocument();
        expect(screen.getByText('Your Account').closest('a')).toHaveAttribute('href', '/account');
        expect(screen.getByText('Your Orders')).toBeInTheDocument();
        expect(screen.getByText('Your Orders').closest('a')).toHaveAttribute('href', '/account/orders');

        // Verify heading
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Order FORMATTED_order123');

        // Verify order details form
        const orderForm = screen.getByTestId('order-details-form');
        expect(orderForm).toBeInTheDocument();
        expect(orderForm.textContent).toContain(JSON.stringify({
            order: mockOrder,
            isAdmin: false,
        }));
    });

});
