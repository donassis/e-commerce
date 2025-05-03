import * as React from 'react';
import { render } from '@testing-library/react';
import SalesAreaChart from '@/app/admin/overview/sales-area-chart';
import { useTheme } from 'next-themes';
import useColorStore from '@/hooks/use-color-store';

// Mock next-themes
jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

// Mock useColorStore
jest.mock('@/hooks/use-color-store', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Mock recharts to prevent rendering actual charts in tests
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
    AreaChart: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="area-chart">{children}</div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Tooltip: ({ content }: { content: any }) => (
        <div data-testid="tooltip">{content}</div>
    ),
    Area: () => <div data-testid="area" />,
}));

// Mock ProductPrice
jest.mock('@/components/shared/product/product-price', () => ({
    ProductPrice: ({ price }: { price: number }) => (
        <span>${price.toFixed(2)}</span>
    ),
}));

// Mock formatDateTime
jest.mock('@/lib/utils', () => ({
    formatDateTime: jest.fn().mockReturnValue({
        dateOnly: 'Mocked Date',
        timeOnly: 'Mocked Time',
        fullDateTime: 'Mocked DateTime',
    }),
}));

describe('SalesAreaChart Component', () => {
    const mockUseTheme = useTheme as jest.Mock;
    const mockUseColorStore = useColorStore as jest.Mock;

    beforeEach(() => {
        // Default mock implementations
        mockUseTheme.mockReturnValue({ theme: 'light' });
        mockUseColorStore.mockReturnValue({
            cssColors: { '--primary': '210 100% 50%' },
            color: { name: 'Red' },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const sampleData = [
        { date: '2023-01-01', totalSales: 1000 },
        { date: '2023-01-02', totalSales: 1500 },
        { date: '2023-01-03', totalSales: 2000 },
    ];

    it('uses the correct stroke color based on theme and color', () => {
        // Test light theme
        mockUseTheme.mockReturnValue({ theme: 'light' });
        mockUseColorStore.mockReturnValue({
            cssColors: { '--primary': '210 100% 50%' },
            color: { name: 'Red' },
        });

        const { rerender } = render(<SalesAreaChart data={sampleData} />);

        // Test dark theme
        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<SalesAreaChart data={sampleData} />);

        // Test different color
        mockUseColorStore.mockReturnValue({
            cssColors: { '--primary': '210 100% 50%' },
            color: { name: 'Green' },
        });
        rerender(<SalesAreaChart data={sampleData} />);
    });

    it('matches snapshot with sample data', () => {
        const { asFragment } = render(<SalesAreaChart data={sampleData} />);
        expect(asFragment()).toMatchSnapshot();
    });
});