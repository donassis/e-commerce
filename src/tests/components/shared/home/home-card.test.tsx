import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeCard } from '@/components/shared/home/home-card'; // Adjust the import path as needed

// Mock Next.js components
jest.mock('next/image', () => ({
    __esModule: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} data-testid="next-image" />;
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
        return (
            <a href={href} data-testid="next-link">
                {children}
            </a>
        );
    },
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
    CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card-content" className={className}>
            {children}
        </div>
    ),
    CardFooter: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="card-footer">{children}</div>
    ),
}));

describe('HomeCard', () => {
    const mockCards = [
        {
            title: 'Test Card 1',
            link: { text: 'View all', href: '/test1' },
            items: [
                {
                    name: 'Item 1',
                    image: '/test1.png',
                    href: '/item1',
                    items: ['subitem1', 'subitem2'],
                },
                {
                    name: 'Item 2',
                    image: '/test2.png',
                    href: '/item2',
                },
            ],
        },
        {
            title: 'Test Card 2',
            link: { text: 'See more', href: '/test2' },
            items: [
                {
                    name: 'Item 3',
                    image: '/test3.png',
                    href: '/item3',
                },
            ],
        },
    ];

    it('renders the correct number of cards', () => {
        render(<HomeCard cards={mockCards} />);
        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(2);
    });

    it('renders card titles correctly', () => {
        render(<HomeCard cards={mockCards} />);
        expect(screen.getByText('Test Card 1')).toBeInTheDocument();
        expect(screen.getByText('Test Card 2')).toBeInTheDocument();
    });

    it('renders all card items', () => {
        render(<HomeCard cards={mockCards} />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders the correct number of images', () => {
        render(<HomeCard cards={mockCards} />);
        const images = screen.getAllByTestId('next-image');
        expect(images).toHaveLength(3); // Total items across all cards
    });

    it('renders links with correct hrefs', () => {
        render(<HomeCard cards={mockCards} />);
        const links = screen.getAllByTestId('next-link');

        // Check item links
        expect(links[0].getAttribute('href')).toBe('/item1');
        expect(links[1].getAttribute('href')).toBe('/item2');

        // Check footer links
        expect(links[4].getAttribute('href')).toBe('/test2');
    });

    it('renders footer links with correct text', () => {
        render(<HomeCard cards={mockCards} />);
        expect(screen.getByText('View all')).toBeInTheDocument();
        expect(screen.getByText('See more')).toBeInTheDocument();
    });

    it('renders images with correct props', () => {
        render(<HomeCard cards={mockCards} />);
        const images = screen.getAllByTestId('next-image');

        expect(images[0].getAttribute('src')).toBe('/test1.png');
        expect(images[0].getAttribute('alt')).toBe('Item 1');
        expect(images[0].getAttribute('height')).toBe('120');
        expect(images[0].getAttribute('width')).toBe('120');

        expect(images[1].getAttribute('src')).toBe('/test2.png');
        expect(images[2].getAttribute('src')).toBe('/test3.png');
    });

    it('renders cards with correct styling', () => {
        render(<HomeCard cards={mockCards} />);
        const cards = screen.getAllByTestId('card');
        cards.forEach(card => {
            expect(card).toHaveClass('rounded-none');
            expect(card).toHaveClass('flex');
            expect(card).toHaveClass('flex-col');
        });
    });

    it('renders CardContent with correct props', () => {
        render(<HomeCard cards={mockCards} />);
        const cardContents = screen.getAllByTestId('card-content');
        cardContents.forEach(content => {
            expect(content).toHaveClass('p-4');
            expect(content).toHaveClass('flex-1');
        });
    });

    it('handles cards with no items gracefully', () => {
        const emptyCards = [
            {
                title: 'Empty Card',
                link: { text: 'Nothing here', href: '/empty' },
                items: [],
            },
        ];

        render(<HomeCard cards={emptyCards} />);
        expect(screen.getByText('Empty Card')).toBeInTheDocument();
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
        const images = screen.queryAllByTestId('next-image');
        expect(images).toHaveLength(0);
    });

    it('renders card with long item names properly', () => {
        const cardsWithLongNames = [
            {
                title: 'Long Names',
                link: { text: 'View', href: '/long' },
                items: [
                    {
                        name: 'This is a very long item name that should be truncated with ellipsis',
                        image: '/long.png',
                        href: '/long-item',
                    },
                ],
            },
        ];

        render(<HomeCard cards={cardsWithLongNames} />);
        const itemText = screen.getByText('This is a very long item name that should be truncated with ellipsis');
        expect(itemText).toHaveClass('text-ellipsis');
        expect(itemText).toHaveClass('overflow-hidden');
        expect(itemText).toHaveClass('whitespace-nowrap');
    });
});