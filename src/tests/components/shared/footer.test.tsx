import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react before importing the component
jest.mock('lucide-react', () => ({
    ChevronUp: () => <svg data-testid="chevron-up-icon" />
}));

// Now import the component that uses lucide-react
import Footer from '../../../components/shared/footer';
import { APP_NAME } from '@/lib/constants';

// Mock the next/link component
jest.mock('next/link', () => {
    const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
    MockLink.displayName = 'MockLink'; // Add displayName
    return MockLink;
});

// Mock window.scrollTo
const scrollToMock = jest.fn();
window.scrollTo = scrollToMock as unknown as typeof window.scrollTo;

describe('Footer Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with all required elements', () => {
        render(<Footer />);

        // Check if the "Back to top" button exists
        const backToTopButton = screen.getByRole('button', { name: /back to top/i });
        expect(backToTopButton).toBeInTheDocument();

        // Check if all required links are present
        expect(screen.getByText('Conditions of Use')).toBeInTheDocument();
        expect(screen.getByText('Privacy Notice')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();

        // Check if links have correct href
        expect(screen.getByText('Conditions of Use').closest('a')).toHaveAttribute('href', '/page/conditions-of-use');
        expect(screen.getByText('Privacy Notice').closest('a')).toHaveAttribute('href', '/page/privacy-notice');
        expect(screen.getByText('Help').closest('a')).toHaveAttribute('href', '/page/help');

        // Check if copyright text includes current year and app name
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(`© ${currentYear} ${APP_NAME}`))).toBeInTheDocument();

        // Check if address text is present
        expect(screen.getByText('1234 Main St, Anytown, USA')).toBeInTheDocument();
    });

    it('scrolls to top when "Back to top" button is clicked', () => {
        render(<Footer />);

        const backToTopButton = screen.getByRole('button', { name: /back to top/i });
        fireEvent.click(backToTopButton);

        // Check if window.scrollTo was called with correct parameters
        expect(scrollToMock).toHaveBeenCalledTimes(1);
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        });
    });

    it('renders ChevronUp icon in the "Back to top" button', () => {
        render(<Footer />);

        // Check if the icon is in the document - using our mock's testid
        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
    });
});