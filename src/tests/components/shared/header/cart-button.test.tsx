import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import CartButton from '@/components/shared/header/cart-button';

// Mock the hooks - using ES module imports instead of require()
jest.mock('@/hooks/use-is-mounted', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue(true)
}));

jest.mock('@/hooks/use-cart-store', () => {
    const mockCartStore = {
        cart: {
            items: [
                { id: '1', quantity: 2 },
                { id: '2', quantity: 3 },
            ],
        }
    };
    return {
        __esModule: true,
        default: jest.fn().mockReturnValue(mockCartStore)
    };
});

jest.mock('@/hooks/use-cart-sidebar', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue(false)
}));

// Mock Lucide react icons
jest.mock('lucide-react', () => {
    // Add display name to fix react/display-name error
    const ShoppingCartIcon = () => <svg data-testid="cart-icon" />;
    ShoppingCartIcon.displayName = 'ShoppingCartIcon';

    return {
        ShoppingCartIcon
    };
});

// Mock Next.js Link with displayName
jest.mock('next/link', () => {
    const LinkComponent = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
    LinkComponent.displayName = 'Link';
    return LinkComponent;
});

describe('CartButton Component', () => {
    // Import hooks at the module level to avoid require() calls
    const useIsMounted = jest.requireMock('@/hooks/use-is-mounted').default;
    const useCartStore = jest.requireMock('@/hooks/use-cart-store').default;
    const useCartSidebar = jest.requireMock('@/hooks/use-cart-sidebar').default;

    beforeEach(() => {
        // Reset mock implementations
        useIsMounted.mockReturnValue(true);
        useCartStore.mockReturnValue({
            cart: {
                items: [
                    { id: '1', quantity: 2 },
                    { id: '2', quantity: 3 },
                ],
            }
        });
        useCartSidebar.mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with cart items count', () => {
        render(<CartButton />);

        expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // 2 + 3 = 5
        expect(screen.getByText('Cart')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/cart');
    });

    it('does not render count when not mounted', () => {
        useIsMounted.mockReturnValue(false);

        render(<CartButton />);

        expect(screen.queryByText('5')).not.toBeInTheDocument();
        expect(screen.getByText('Cart')).toBeInTheDocument();
    });

    it('does not render cart sidebar indicator when sidebar is closed', () => {
        useCartSidebar.mockReturnValue(false);

        render(<CartButton />);

        expect(screen.queryByTestId('cart-sidebar-indicator')).not.toBeInTheDocument();
    });

    it('renders with zero count when cart is empty', () => {
        useCartStore.mockReturnValue({
            cart: {
                items: [],
            },
        });

        render(<CartButton />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });
});