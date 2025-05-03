import React from 'react';
import { render, screen } from '@testing-library/react';
import {HomeCarousel} from '@/components/shared/home/home-carousel';
import Autoplay from 'embla-carousel-autoplay';

// Mock dependencies
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

jest.mock('embla-carousel-autoplay', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        stop: jest.fn(),
        reset: jest.fn(),
    }),
}));

jest.mock('@/components/ui/carousel', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Carousel: ({ children, className, onMouseEnter, onMouseLeave }: any) => (
        <div
            data-testid="carousel"
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    ),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    CarouselPrevious: ({ className }: any) => (
        <button data-testid="carousel-previous" className={className}>Previous</button>
    ),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    CarouselNext: ({ className }: any) => (
        <button data-testid="carousel-next" className={className}>Next</button>
    ),
}));

jest.mock('@/components/ui/button', () => ({
    __esModule: true,
    Button: ({ children, className }: any) => (
        <button data-testid="button" className={className}>{children}</button>
    ),
}));

describe('HomeCarousel', () => {
    const mockItems = [
        {
            image: '/slide1.jpg',
            url: '/promo1',
            title: 'Promotion 1',
            buttonCaption: 'Shop Now',
        },
        {
            image: '/slide2.jpg',
            url: '/promo2',
            title: 'Promotion 2',
            buttonCaption: 'Learn More',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all carousel items', () => {
        render(<HomeCarousel items={mockItems} />);

        const items = screen.getAllByTestId('carousel-item');
        expect(items).toHaveLength(mockItems.length);

        mockItems.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
            expect(screen.getByText(item.buttonCaption)).toBeInTheDocument();
        });
    });

    it('renders images with correct props', () => {
        render(<HomeCarousel items={mockItems} />);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(mockItems.length);

        mockItems.forEach((item, index) => {
            expect(images[index]).toHaveAttribute('src', item.image);
            expect(images[index]).toHaveAttribute('alt', item.title);
            expect(images[index]).toHaveClass('object-cover');
        });
    });

    it('renders navigation buttons', () => {
        render(<HomeCarousel items={mockItems} />);

        expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
        expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
        expect(screen.getByTestId('carousel-previous')).toHaveClass('left-0');
        expect(screen.getByTestId('carousel-next')).toHaveClass('right-0');
    });

    it('initializes autoplay plugin with correct settings', () => {
        render(<HomeCarousel items={mockItems} />);

        expect(Autoplay).toHaveBeenCalledWith({
            delay: 3000,
            stopOnInteraction: true,
        });
    });

    it('renders links with correct hrefs', () => {
        render(<HomeCarousel items={mockItems} />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(mockItems.length);

        mockItems.forEach((item, index) => {
            expect(links[index]).toHaveAttribute('href', item.url);
        });
    });

    it('hides button on mobile view', () => {
        render(<HomeCarousel items={mockItems} />);

        const buttons = screen.getAllByTestId('button');
        buttons.forEach(button => {
            expect(button).toHaveClass('hidden');
            expect(button).toHaveClass('md:block');
        });
    });

    it('positions text content correctly', () => {
        render(<HomeCarousel items={mockItems} />);

        const textContainers = screen.getAllByText(mockItems[0].title)
            .map(el => el.parentElement);

        textContainers.forEach(container => {
            expect(container).toHaveClass('absolute');
            expect(container).toHaveClass('left-16');
            expect(container).toHaveClass('md:left-32');
            expect(container).toHaveClass('top-1/2');
            expect(container).toHaveClass('transform');
            expect(container).toHaveClass('-translate-y-1/2');
        });
    });
});