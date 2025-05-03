import { render, screen } from '@testing-library/react';
import Search from '@/components/shared/header/search';

// Mock dependencies
jest.mock('lucide-react', () => ({
    SearchIcon: () => <svg data-testid="search-icon" />,
}));

jest.mock('@/components/ui/input', () => {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const React = require('react');
    return {
        __esModule: true,
        /* eslint-disable @typescript-eslint/no-explicit-any, react/display-name */
        Input: React.forwardRef((props: any, ref: any) => (
            <input {...props} ref={ref} data-testid="search-input" />
        )),
    };
});

jest.mock('@/components/ui/select', () => {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const React = require('react');
    return {
        __esModule: true,
        Select: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="select">{children}</div>
        ),
        SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <button data-testid="select-trigger" className={className}>
                {children}
            </button>
        ),
        SelectContent: ({ children, position }: { children: React.ReactNode; position?: string }) => (
            <div data-testid="select-content" data-position={position}>
                {children}
            </div>
        ),
        SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
            <div data-testid="select-item" data-value={value}>
                {children}
            </div>
        ),
        SelectValue: ({ placeholder }: { placeholder?: string }) => (
            <span data-testid="select-value">{placeholder}</span>
        ),
    };
});

jest.mock('@/lib/actions/product.actions', () => ({
    getAllCategories: jest.fn().mockResolvedValue(['Electronics', 'Clothing', 'Home']),
}));

jest.mock('@/lib/constants', () => ({
    APP_NAME: 'TestStore',
}));

describe('Search', () => {
    it('renders correctly', async () => {
        render(await Search());

        expect(screen.getByTestId('select')).toBeInTheDocument();
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
        expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('renders category options', async () => {
        render(await Search());

        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
    });
});