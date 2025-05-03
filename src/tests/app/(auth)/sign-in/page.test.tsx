import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from '@/app/(auth)/sign-in/page';
import { auth } from '@/auth';
import { APP_NAME } from '@/lib/constants';
import * as nextNavigation from 'next/navigation';

// Mock the dependencies
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

jest.mock('@/auth', () => ({
    auth: jest.fn(),
}));

jest.mock('@/app/(auth)/sign-in/credentials-signin-form', () => {
    const CredentialsSignInForm = () => <div>CredentialsSignInForm Mock</div>;
    CredentialsSignInForm.displayName = 'MockCredentialsSignInForm';
    return { __esModule: true, default: CredentialsSignInForm };
});

jest.mock('@/components/shared/separator-or', () => {
    const SeparatorWithOr = ({ children }: { children: React.ReactNode }) => (
        <div>SeparatorWithOr Mock - {children}</div>
    );
    SeparatorWithOr.displayName = 'MockSeparatorWithOr';
    return { __esModule: true, default: SeparatorWithOr };
});

jest.mock('@/components/ui/card', () => {
    const Card = ({ children }: { children: React.ReactNode }) => <div>Card Mock - {children}</div>;
    const CardHeader = ({ children }: { children: React.ReactNode }) => <div>CardHeader Mock - {children}</div>;
    const CardContent = ({ children }: { children: React.ReactNode }) => <div>CardContent Mock - {children}</div>;
    const CardTitle = ({ children }: { children: React.ReactNode }) => <div>CardTitle Mock - {children}</div>;

    Card.displayName = 'MockCard';
    CardHeader.displayName = 'MockCardHeader';
    CardContent.displayName = 'MockCardContent';
    CardTitle.displayName = 'MockCardTitle';

    return {
        __esModule: true,
        Card,
        CardHeader,
        CardContent,
        CardTitle,
    };
});

type ButtonMockProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

jest.mock('@/components/ui/button', () => {
    const Button = ({ children, ...props }: ButtonMockProps) => (
        <button {...props}>Button Mock - {children}</button>
    );
    Button.displayName = 'MockButton';
    return { __esModule: true, Button };
});


jest.mock('next/link', () => {
    const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>Link Mock - {children}</a>
    );
    Link.displayName = 'MockLink';
    return { __esModule: true, default: Link };
});

describe('SignIn Component', () => {
    const mockSearchParams = {
        callbackUrl: '/dashboard',
    };

    const mockSearchParamsWithDefault = {
        callbackUrl: '/',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to callbackUrl if session exists', async () => {
        (auth as jest.Mock).mockResolvedValue({ user: { id: '123' } });

        const searchParamsPromise = Promise.resolve(mockSearchParams);

        const Component = await SignIn({ searchParams: searchParamsPromise });
        render(Component);

        expect(nextNavigation.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should render the sign-in form when no session exists', async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        const searchParamsPromise = Promise.resolve(mockSearchParams);
        const Component = await SignIn({ searchParams: searchParamsPromise });
        render(Component);

        expect(screen.getByText('CardTitle Mock - Sign In')).toBeInTheDocument();
        expect(screen.getByText('CredentialsSignInForm Mock')).toBeInTheDocument();
        expect(screen.getByText(`SeparatorWithOr Mock - New to ${APP_NAME}?`)).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            expect.stringContaining('/sign-up?callbackUrl=%2Fdashboard'),
        );
    });

    it('should use default callbackUrl when not provided in searchParams', async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        const searchParamsPromise = Promise.resolve(mockSearchParamsWithDefault);
        const Component = await SignIn({ searchParams: searchParamsPromise });
        render(Component);

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            expect.stringContaining('/sign-up?callbackUrl=%2F'),
        );
    });
});
