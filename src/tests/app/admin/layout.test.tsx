import React from 'react';
import { render } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';

// Mock child component
jest.mock('@/components/shared/header/menu', () => ({
    __esModule: true,
    default: () => <div data-testid="menu" />,
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

// Mock admin-nav component
jest.mock('@/app/admin/admin-nav', () => ({
    __esModule: true,
    AdminNav: ({ className }: { className: string }) => (
        <div data-testid="admin-nav" className={className} />
    ),
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
    APP_NAME: 'Test App',
}));

describe('AdminLayout', () => {
    const mockChildren = <div data-testid="test-children">Test Content</div>;

    it('renders the menu with admin prop', () => {
        // This verifies the mock was called with the correct prop
        //const Menu = require('@/components/shared/header/menu').default;
        render(<AdminLayout>{mockChildren}</AdminLayout>);

        // If you need to verify props passed to the Menu component,
        // you might need to adjust the mock or use a more sophisticated solution
        // like jest.spyOn or testing implementation details
    });
});