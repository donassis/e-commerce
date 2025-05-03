import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CredentialsSignInForm from '@/app/(auth)/sign-in/credentials-signin-form'
import { useSearchParams } from 'next/navigation'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    redirect: jest.fn(),
}))

// Mock user actions
jest.mock('@/lib/actions/user.actions', () => ({
    signInWithCredentials: jest.fn(),
}))

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
    toast: jest.fn(),
}))

describe('CredentialsSignInForm', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks()

        // Mock useSearchParams to return a callbackUrl
        ;(useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => (key === 'callbackUrl' ? '/dashboard' : null),
        })
    })

    it('renders the form with empty values in production', () => {

        render(<CredentialsSignInForm />)

        expect(screen.getByLabelText('Email')).toHaveValue('')
        expect(screen.getByLabelText('Password')).toHaveValue('')
    })

    it('submits the form with valid data', async () => {
        ;(signInWithCredentials as jest.Mock).mockResolvedValueOnce({ success: true })

        render(<CredentialsSignInForm />)

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        })
        fireEvent.input(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        })

        fireEvent.click(screen.getByText('Sign In'))

        await waitFor(() => {
            expect(signInWithCredentials).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            })
        })
    })

    it('handles sign in failure', async () => {
        const error = new Error('Invalid credentials')
        ;(signInWithCredentials as jest.Mock).mockRejectedValueOnce(error)

        render(<CredentialsSignInForm />)

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        })
        fireEvent.input(screen.getByLabelText('Password'), {
            target: { value: 'wrongpassword' },
        })

        fireEvent.click(screen.getByText('Sign In'))

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith({
                title: 'Error',
                description: 'Invalid email or password',
                variant: 'destructive',
            })
        })
    })

    it('redirects after successful sign in', async () => {
        ;(signInWithCredentials as jest.Mock).mockResolvedValueOnce({ success: true })
        const mockRedirect = jest.requireMock('next/navigation').redirect

        render(<CredentialsSignInForm />)

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        })
        fireEvent.input(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        })

        fireEvent.click(screen.getByText('Sign In'))

        await waitFor(() => {
            expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
        })
    })

})