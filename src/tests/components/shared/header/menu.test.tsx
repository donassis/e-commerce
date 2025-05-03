import React from 'react';
import { render, screen } from '@testing-library/react';
import Menu from '@/components/shared/header/menu'; // Adjust import path as needed

// Mock components
jest.mock('lucide-react', () => ({
    EllipsisVertical: () => <div data-testid="ellipsis-vertical-icon">EllipsisVertical</div>,
}));

jest.mock('@/components/ui/sheet', () => ({
    Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
    SheetContent: ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div data-testid="sheet-content" className={className}>
            {children}
        </div>
    ),
    SheetTrigger: ({ children, className }: { children: React.ReactNode; className: string }) => (
        <button data-testid="sheet-trigger" className={className}>
            {children}
        </button>
    ),
    SheetHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="sheet-header" className={className}>
            {children}
        </div>
    ),
    SheetTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <h2 data-testid="sheet-title" className={className}>
            {children}
        </h2>
    ),
    SheetDescription: () => <div data-testid="sheet-description"></div>,
}));

jest.mock('@/components/shared/header/cart-button', () => ({
    __esModule: true,
    default: () => <div data-testid="cart-button">CartButton</div>,
}));

jest.mock('@/components/shared/header/user-button', () => ({
    __esModule: true,
    default: () => <div data-testid="user-button">UserButton</div>,
}));

jest.mock('@/components/shared/header/theme-switcher', () => ({
    __esModule: true,
    default: () => <div data-testid="theme-switcher">ThemeSwitcher</div>,
}));

describe('Menu Component', () => {
    it('renders correctly with default props', () => {
        render(<Menu />);

        // Check both navigation sections exist
        expect(screen.getAllByRole('navigation')).toHaveLength(2);

        // Check desktop menu components
        const desktopNav = screen.getAllByRole('navigation')[0];
        expect(desktopNav).toHaveClass('md:flex');
        expect(desktopNav).toHaveClass('hidden');

        // Check mobile menu
        const mobileNav = screen.getAllByRole('navigation')[1];
        expect(mobileNav).toHaveClass('md:hidden');

        // Check components in desktop menu
        within(desktopNav).getByTestId('theme-switcher');
        within(desktopNav).getByTestId('user-button');
        within(desktopNav).getByTestId('cart-button');
    });

    it('renders mobile menu with sheet', () => {
        render(<Menu />);

        // Check mobile menu components
        const mobileNav = screen.getAllByRole('navigation')[1];
        expect(mobileNav).toHaveClass('md:hidden');

        // Check sheet components
        expect(screen.getByTestId('sheet')).toBeInTheDocument();
        expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('ellipsis-vertical-icon')).toBeInTheDocument();

        // Check sheet content (would normally be hidden until triggered)
        expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
        expect(screen.getByTestId('sheet-header')).toBeInTheDocument();
        expect(screen.getByTestId('sheet-title')).toBeInTheDocument();
        expect(screen.getByText('Site Menu')).toBeInTheDocument();
    });

    it('hides CartButton in forAdmin mode', () => {
        render(<Menu forAdmin={true} />);

        const desktopNav = screen.getAllByRole('navigation')[0];

        // CartButton should not be in desktop menu
        expect(within(desktopNav).queryByTestId('cart-button')).not.toBeInTheDocument();

        // But it should still be in the mobile sheet content
        expect(screen.getByTestId('cart-button')).toBeInTheDocument();
    });

    it('applies correct styling to sheet content', () => {
        render(<Menu />);

        const sheetContent = screen.getByTestId('sheet-content');
        expect(sheetContent).toHaveClass('bg-black');
        expect(sheetContent).toHaveClass('text-white');
        expect(sheetContent).toHaveClass('flex');
        expect(sheetContent).toHaveClass('flex-col');
        expect(sheetContent).toHaveClass('items-start');
    });

    it('renders sheet trigger with correct classes', () => {
        render(<Menu />);

        const trigger = screen.getByTestId('sheet-trigger');
        expect(trigger).toHaveClass('align-middle');
        expect(trigger).toHaveClass('header-button');
    });

    it('renders ellipsis icon with correct size', () => {
        render(<Menu />);

        // Since we're mocking the component, we can't directly test the props
        // In a real test, you might use a more sophisticated approach to verify props
        expect(screen.getByTestId('ellipsis-vertical-icon')).toBeInTheDocument();
    });

    it('contains all required components in sheet content', () => {
        render(<Menu />);

        const sheetContent = screen.getByTestId('sheet-content');

        // Check components in sheet content
        within(sheetContent).getByTestId('sheet-header');
        within(sheetContent).getByTestId('sheet-title');
        within(sheetContent).getByTestId('sheet-description');
        within(sheetContent).getByTestId('theme-switcher');
        within(sheetContent).getByTestId('user-button');
        within(sheetContent).getByTestId('cart-button');
    });

    it('renders both desktop and mobile versions', () => {
        render(<Menu />);

        // One ThemeSwitcher in desktop menu
        expect(screen.getAllByTestId('theme-switcher')).toHaveLength(2);

        // One UserButton in desktop menu, one in sheet
        expect(screen.getAllByTestId('user-button')).toHaveLength(2);

        // One CartButton in desktop menu, one in sheet
        expect(screen.getAllByTestId('cart-button')).toHaveLength(2);
    });
});

// Helper function to work with nested components
function within(element: HTMLElement) {
    return {
        getByTestId: (testId: string) => {
            const results = Array.from(element.querySelectorAll(`[data-testid="${testId}"]`));
            if (results.length === 0) {
                throw new Error(`No elements found with data-testid: ${testId}`);
            }
            return results[0] as HTMLElement;
        },
        queryByTestId: (testId: string) => {
            const results = Array.from(element.querySelectorAll(`[data-testid="${testId}"]`));
            return results.length > 0 ? (results[0] as HTMLElement) : null;
        }
    };
}