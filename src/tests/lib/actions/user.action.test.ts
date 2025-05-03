import {
    signInWithCredentials,
    SignOut
} from '@/lib/actions/user.actions';

// Mock dependencies
// Update your mock at the top of the file (replace the existing one)
jest.mock('@/auth', () => ({
    __esModule: true,
    auth: jest.fn(),
    signIn: jest.fn(() => Promise.resolve({ ok: true })), // Default implementation
    signOut: jest.fn()
}));

jest.mock('next/navigation', () => ({
    redirect: jest.fn()
}));

jest.mock('@/lib/validator', () => ({
    UserSignUpSchema: {
        parseAsync: jest.fn()
    }
}));

jest.mock('@/lib/db', () => ({
    connectToDatabase: jest.fn()
}));

jest.mock('@/lib/db/models/user.model', () => ({
    default: {
        create: jest.fn(),
        findById: jest.fn()
    }
}));

jest.mock('@/lib/utils', () => ({
    formatError: jest.fn((error: Error | { message?: string }) => `Formatted: ${error.message || 'Unknown error'}`)
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn()
}));

import { signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';

describe('Server Actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signInWithCredentials', () => {
        it('should call signIn with correct parameters', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };
            const expectedResult = { ok: true };

            (signIn as jest.Mock).mockResolvedValue(expectedResult);

            const result = await signInWithCredentials(mockUser);

            expect(signIn).toHaveBeenCalledWith('credentials', {
                ...mockUser,
                redirect: false
            });
            expect(result).toBe(expectedResult);
        });

        it('should propagate errors from signIn', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };
            const mockError = new Error('Authentication failed');

            (signIn as jest.Mock).mockRejectedValue(mockError);

            await expect(signInWithCredentials(mockUser)).rejects.toThrow('Authentication failed');
            expect(signIn).toHaveBeenCalledWith('credentials', {
                ...mockUser,
                redirect: false
            });
        });
    });

    describe('SignOut', () => {
        it('should sign out and redirect', async () => {
            const mockRedirectPath = { redirect: '/login' };

            (signOut as jest.Mock).mockResolvedValue(mockRedirectPath);

            await SignOut();

            expect(signOut).toHaveBeenCalledWith({ redirect: false });
            expect(redirect).toHaveBeenCalledWith('/login');
        });
    });

    describe('registerUser', () => {
        it('should call signIn with correct parameters', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };
            const expectedResult = { ok: true };

            // Ensure we're working with the mock
            const signInMock = signIn as jest.MockedFunction<typeof signIn>;
            signInMock.mockResolvedValue(expectedResult);

            const result = await signInWithCredentials(mockUser);

            expect(signInMock).toHaveBeenCalledWith('credentials', {
                ...mockUser,
                redirect: false
            });
            expect(result).toBe(expectedResult);
        });
    });
});