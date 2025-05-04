import React from 'react';
import { render, screen } from '@testing-library/react';
import CartAddItem from '@/app/(root)/cart/[itemId]/cart-add-item';
import  useCartStore from '@/hooks/use-cart-store';
import { notFound } from 'next/navigation';

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

jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

jest.mock('lucide-react', () => ({
    CheckCircle2Icon: () => <svg data-testid="check-icon" />,
}));

jest.mock('@/components/shared/product/product-price', () => ({
    __esModule: true,
    default: ({ price, className }: { price: number; className?: string; plain?: boolean }) => (
        <span data-testid="product-price" className={className}>
      ${price.toFixed(2)}
    </span>
    ),
}));

jest.mock('@/components/shared/browsing-history-list', () => ({
    __esModule: true,
    default: () => <div data-testid="browsing-history" />,
}));

jest.mock('@/components/ui/card', () => ({
    __esModule: true,
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
    CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card-content" className={className}>
            {children}
        </div>
    ),
}));

jest.mock('@/components/ui/button', () => ({
    __esModule: true,
    buttonVariants: jest.fn().mockImplementation((options) => {
        const base = 'button-base';
        const variant = options?.variant === 'outline' ? 'button-outline' : 'button-primary';
        return `${base} ${variant}`;
    }),
}));

jest.mock('@/hooks/use-cart-store', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/lib/constants', () => ({
    FREE_SHIPPING_MIN_PRICE: 50,
}));

describe('CartAddItem', () => {
    const mockItem = {
        clientId: 'item1',
        slug: 'product-1',
        name: 'Test Product',
        image: '/product1.jpg',
        color: 'Red',
        size: 'M',
        quantity: 1,
        price: 19.99,
    };

    beforeEach(() => {
        (useCartStore as unknown as jest.Mock).mockReturnValue({
            cart: {
                items: [mockItem],
                itemsPrice: 19.99,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows free shipping message when threshold is met', () => {
        (useCartStore as unknown as jest.Mock).mockReturnValue({
            cart: {
                items: [mockItem],
                itemsPrice: 50,
            },
        });

        render(<CartAddItem itemId="item1" />);

        expect(screen.getByText(/Your order qualifies for FREE Shipping/)).toBeInTheDocument();
    });

    it('renders cart subtotal correctly', () => {
        render(<CartAddItem itemId="item1" />);

        expect(screen.getByText('Cart Subtotal:')).toBeInTheDocument();
        expect(screen.getByText('$19.99')).toBeInTheDocument();
    });

    it('renders checkout and cart buttons correctly', () => {
        render(<CartAddItem itemId="item1" />);

        const checkoutButton = screen.getByText('Proceed to checkout (1 items)');
        expect(checkoutButton).toBeInTheDocument();
        expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout');

        const cartButton = screen.getByText('Go to Cart');
        expect(cartButton).toBeInTheDocument();
        expect(cartButton.closest('a')).toHaveAttribute('href', '/cart');
    });

    it('renders browsing history list', () => {
        render(<CartAddItem itemId="item1" />);
        expect(screen.getByTestId('browsing-history')).toBeInTheDocument();
    });

    it('returns notFound when item is not in cart', () => {
        (useCartStore as unknown as jest.Mock).mockReturnValue({
            cart: {
                items: [],
                itemsPrice: 0,
            },
        });

        render(<CartAddItem itemId="non-existent" />);
        expect(notFound).toHaveBeenCalled();
    });
});