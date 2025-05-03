import * as React from 'react';
import Pagination from '@/components/shared/pagination'; // Adjust the import path as needed
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';


// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
    Button: jest.fn(({ children, onClick, disabled }) => (
        <button onClick={onClick} disabled={disabled} data-testid="mock-button">
            {children}
        </button>
    ))
}));

// Mock the formUrlQuery utility
jest.mock('@/lib/utils', () => ({
    formUrlQuery: jest.fn().mockImplementation(({ params, key, value }) =>
        `?${params}&${key}=${value}`
    ),
    cn: jest.fn().mockImplementation((...args) => args.join(' '))
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ChevronLeft: () => <span data-testid="chevron-left">←</span>,
    ChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

describe('Pagination Component', () => {
    const mockPush = jest.fn();
    const mockSearchParams = new URLSearchParams('param1=value1');

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with current page and total pages', () => {
        render(<Pagination page={2} totalPages={5} />);

        expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
        expect(screen.getAllByTestId('mock-button')).toHaveLength(2);
    });

    it('disables Previous button when on first page', () => {
        render(<Pagination page={1} totalPages={5} />);

        const buttons = screen.getAllByTestId('mock-button');
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).not.toBeDisabled();
    });

    it('disables Next button when on last page', () => {
        render(<Pagination page={5} totalPages={5} />);

        const buttons = screen.getAllByTestId('mock-button');
        expect(buttons[0]).not.toBeDisabled();
        expect(buttons[1]).toBeDisabled();
    });

    it('calls onClick with "prev" when Previous button is clicked', async () => {
        const user = userEvent.setup();
        render(<Pagination page={2} totalPages={5} />);

        const buttons = screen.getAllByTestId('mock-button');
        await user.click(buttons[0]);

        expect(mockPush).toHaveBeenCalledWith('?param1=value1&page=1', { scroll: true });
    });

    it('calls onClick with "next" when Next button is clicked', async () => {
        const user = userEvent.setup();
        render(<Pagination page={2} totalPages={5} />);

        const buttons = screen.getAllByTestId('mock-button');
        await user.click(buttons[1]);

        expect(mockPush).toHaveBeenCalledWith('?param1=value1&page=3', { scroll: true });
    });

    it('uses custom urlParamName when provided', async () => {
        const user = userEvent.setup();
        render(<Pagination page={2} totalPages={5} urlParamName="customPage" />);

        const buttons = screen.getAllByTestId('mock-button');
        await user.click(buttons[1]);

        expect(mockPush).toHaveBeenCalledWith('?param1=value1&customPage=3', { scroll: true });
    });

    it('handles string page numbers', async () => {
        const user = userEvent.setup();
        render(<Pagination page="3" totalPages={5} />);

        const buttons = screen.getAllByTestId('mock-button');
        await user.click(buttons[1]);

        expect(mockPush).toHaveBeenCalledWith('?param1=value1&page=4', { scroll: true });
    });

    it('renders chevron icons', () => {
        render(<Pagination page={2} totalPages={5} />);

        expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
        expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    });
});