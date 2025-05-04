import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductPrice from '@/components/shared/product/product-price';
import {formatCurrency } from '@/lib/utils';

// Mock utility functions
jest.mock('@/lib/utils', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
    formatCurrency: jest.fn((price: number) => `$${price.toFixed(2)}`),
}));

describe('ProductPrice', () => {
    const mockPrice = 19.99;
    const mockListPrice = 29.99;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders plain price correctly', () => {
        render(<ProductPrice price={mockPrice} plain />);
        expect(formatCurrency).toHaveBeenCalledWith(mockPrice);
        expect(screen.getByText(`$${mockPrice.toFixed(2)}`)).toBeInTheDocument();
    });

    it('renders simple price without list price', () => {
        render(<ProductPrice price={mockPrice} />);

        const dollarSign = screen.getByText('$', { selector: 'span' });
        const integerPart = screen.getByText('19');
        const decimalPart = screen.getByText('99');

        expect(dollarSign).toHaveClass('text-xs align-super');
        expect(integerPart).toBeInTheDocument();
        expect(decimalPart).toHaveClass('text-xs align-super');
    });

    it('renders deal price correctly', () => {
        render(
            <ProductPrice
                price={mockPrice}
                listPrice={mockListPrice}
                isDeal
            />
        );

        // Verify discount badge
        const discountBadge = screen.getByText('33% Off');
        expect(discountBadge).toHaveClass('bg-red-700');
        expect(discountBadge).toHaveClass('text-white');

        // Verify deal text
        expect(screen.getByText('Limited time deal')).toBeInTheDocument();

        // Verify current price
        expect(screen.getByText('19')).toBeInTheDocument();
        expect(screen.getByText('99')).toBeInTheDocument();

        // Verify list price
        expect(formatCurrency).toHaveBeenCalledWith(mockListPrice);
        expect(screen.getByText(/Was:/)).toBeInTheDocument();
        expect(screen.getByText(`$${mockListPrice.toFixed(2)}`)).toHaveClass('line-through');
    });

    it('renders non-deal discounted price correctly', () => {
        render(
            <ProductPrice
                price={mockPrice}
                listPrice={mockListPrice}
            />
        );

        // Verify discount percentage
        expect(screen.getByText('-33%')).toHaveClass('text-orange-700');

        // Verify current price
        expect(screen.getByText('19')).toBeInTheDocument();
        expect(screen.getByText('99')).toBeInTheDocument();

        // Verify list price
        expect(screen.getByText(/List price:/)).toBeInTheDocument();
        expect(screen.getByText(`$${mockListPrice.toFixed(2)}`)).toHaveClass('line-through');
    });

    it('handles integer prices correctly', () => {
        render(<ProductPrice price={20} />);

        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.queryByText(/\./)).not.toBeInTheDocument();
    });

    it('handles zero list price correctly', () => {
        render(<ProductPrice price={mockPrice} listPrice={0} />);

        expect(screen.getByText('19')).toBeInTheDocument();
        expect(screen.queryByText(/Was:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/List price:/)).not.toBeInTheDocument();
    });
});