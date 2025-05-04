import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeSwitcher from '@/components/shared/header/theme-switcher'
import { useTheme } from 'next-themes';
import useColorStore from '@/hooks/use-color-store';
import useIsMounted from '@/hooks/use-is-mounted';

// Mock the hooks and components
jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@/hooks/use-color-store', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/hooks/use-is-mounted', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Define types for the mocked components
interface ChildrenProps {
    children: React.ReactNode;
}

interface ClassNameProps {
    className?: string;
    children: React.ReactNode;
}

interface RadioGroupProps {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
}

interface RadioItemProps {
    children: React.ReactNode;
    value: string;
}

// Mock Dropdown components
jest.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: ChildrenProps) => <div data-testid="dropdown-menu">{children}</div>,
    DropdownMenuContent: ({ children, className }: ClassNameProps) => (
        <div data-testid="dropdown-menu-content" className={className}>
            {children}
        </div>
    ),
    DropdownMenuLabel: ({ children }: ChildrenProps) => <div data-testid="dropdown-menu-label">{children}</div>,
    DropdownMenuRadioGroup: ({ children, value }: RadioGroupProps) => (
        <div data-testid="dropdown-menu-radio-group" data-value={value} onChange={() => {}}>
            {children}
        </div>
    ),
    DropdownMenuRadioItem: ({ children, value }: RadioItemProps) => (
        <div data-testid="dropdown-menu-radio-item" data-value={value} onClick={() => {}}>
            {children}
        </div>
    ),
    DropdownMenuSeparator: () => <hr data-testid="dropdown-menu-separator" />,
    DropdownMenuTrigger: ({ children, className }: ClassNameProps) => (
        <button data-testid="dropdown-menu-trigger" className={className}>
            {children}
        </button>
    ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ChevronDownIcon: () => <span data-testid="chevron-down-icon">ChevronDown</span>,
    Moon: ({ className }: { className?: string }) => <span data-testid="moon-icon" className={className}>Moon</span>,
    Sun: ({ className }: { className?: string }) => <span data-testid="sun-icon" className={className}>Sun</span>,
}));

describe('ThemeSwitcher Component', () => {
    const mockSetTheme = jest.fn();
    const mockSetColor = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementation for useTheme
        (useTheme as jest.Mock).mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme,
        });

        // Default mock implementation for useColorStore
        (useColorStore as jest.Mock).mockReturnValue({
            availableColors: [
                { name: 'blue', value: '#0000ff' },
                { name: 'red', value: '#ff0000' },
            ],
            color: { name: 'blue', value: '#0000ff' },
            setColor: mockSetColor,
        });

        // Default mock implementation for useIsMounted
        (useIsMounted as jest.Mock).mockReturnValue(true);
    });

    it('renders without crashing', () => {
        render(<ThemeSwitcher />);
        expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    });

    it('renders theme radio options correctly', () => {
        render(<ThemeSwitcher />);

        const radioItems = screen.getAllByTestId('dropdown-menu-radio-item');
        expect(radioItems.length).toBeGreaterThanOrEqual(2);

        const darkOption = radioItems.find(item => item.getAttribute('data-value') === 'dark');
        const lightOption = radioItems.find(item => item.getAttribute('data-value') === 'light');

        expect(darkOption).toBeInTheDocument();
        expect(lightOption).toBeInTheDocument();
    });

    it('renders color options from the color store', () => {
        const mockAvailableColors = [
            { name: 'blue', value: '#0000ff' },
            { name: 'red', value: '#ff0000' },
            { name: 'green', value: '#00ff00' },
        ];

        (useColorStore as jest.Mock).mockReturnValue({
            availableColors: mockAvailableColors,
            color: { name: 'blue', value: '#0000ff' },
            setColor: mockSetColor,
        });

        render(<ThemeSwitcher />);

        const radioItems = screen.getAllByTestId('dropdown-menu-radio-item');
        const colorItems = radioItems.filter(item => {
            // Find color radio items by checking if they have one of the color names
            return mockAvailableColors.some(color =>
                item.getAttribute('data-value') === color.name
            );
        });

        expect(colorItems.length).toBe(mockAvailableColors.length);
        expect(colorItems[0]).toHaveTextContent('blue');
        expect(colorItems[1]).toHaveTextContent('red');
        expect(colorItems[2]).toHaveTextContent('green');
    });

});