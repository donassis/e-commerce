import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductGallery from '@/components/shared/product/product-gallery';

// Mock CSS import
jest.mock('react-medium-image-zoom/dist/styles.css', () => ({}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

// Mock react-medium-image-zoom
jest.mock('react-medium-image-zoom', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="zoom-wrapper">{children}</div>
    ),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

// Mock react-medium-image-zoom
jest.mock('react-medium-image-zoom', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="zoom-wrapper">{children}</div>,
}));

describe('ProductGallery', () => {
    const mockImages = [
        '/image1.jpg',
        '/image2.jpg',
        '/image3.jpg',
    ];

    it('sets the first image as selected by default', () => {
        render(<ProductGallery images={mockImages} />);

        const thumbnails = screen.getAllByRole('button');
        expect(thumbnails[0]).toHaveClass('ring-2 ring-blue-500');
        expect(thumbnails[1]).toHaveClass('ring-1 ring-gray-300');
        expect(thumbnails[2]).toHaveClass('ring-1 ring-gray-300');
    });

    it('changes selected image on click', () => {
        render(<ProductGallery images={mockImages} />);

        const thumbnails = screen.getAllByRole('button');
        fireEvent.click(thumbnails[1]);

        expect(thumbnails[0]).toHaveClass('ring-1 ring-gray-300');
        expect(thumbnails[1]).toHaveClass('ring-2 ring-blue-500');
        expect(thumbnails[2]).toHaveClass('ring-1 ring-gray-300');
    });

    it('changes selected image on hover', () => {
        render(<ProductGallery images={mockImages} />);

        const thumbnails = screen.getAllByRole('button');
        fireEvent.mouseOver(thumbnails[2]);

        expect(thumbnails[0]).toHaveClass('ring-1 ring-gray-300');
        expect(thumbnails[1]).toHaveClass('ring-1 ring-gray-300');
        expect(thumbnails[2]).toHaveClass('ring-2 ring-blue-500');
    });

    it('renders the zoomable main image', () => {
        render(<ProductGallery images={mockImages} />);

        const zoomWrapper = screen.getByTestId('zoom-wrapper');
        expect(zoomWrapper).toBeInTheDocument();

        const mainImage = screen.getAllByRole('img')[mockImages.length]; // Main image is after thumbnails
        expect(mainImage).toHaveAttribute('src', mockImages[0]);
        expect(mainImage).toHaveClass('object-contain');
    });

    it('updates main image when thumbnail is selected', () => {
        render(<ProductGallery images={mockImages} />);

        const thumbnails = screen.getAllByRole('button');
        fireEvent.click(thumbnails[1]);

        const mainImage = screen.getAllByRole('img')[mockImages.length];
        expect(mainImage).toHaveAttribute('src', mockImages[1]);
    });

    it('handles empty images array gracefully', () => {
        render(<ProductGallery images={[]} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('zoom-wrapper')).toBeInTheDocument();
    });
});