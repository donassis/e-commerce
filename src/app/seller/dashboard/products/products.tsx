import { IProduct } from '@/lib/db/models/product.model';

// Create a partial type for mocking products without Document interface requirements
type MockProduct = Pick<IProduct,
    | '_id'
    | 'name'
    | 'slug'
    | 'brand'
    | 'category'
    | 'description'
    | 'price'
    | 'listPrice'
    | 'countInStock'
    | 'tags'
    | 'colors'
    | 'sizes'
    | 'avgRating'
    | 'numReviews'
    | 'numSales'
    | 'ratingDistribution'
    | 'images'
    | 'isPublished'
    | 'reviews'
    | 'createdAt'
    | 'updatedAt'
>;

// Mock products data
export const mockProducts: MockProduct[] = [
    {
        _id: 'prod_mock_001',
        name: 'Slim Fit Jeans',
        slug: 'slim-fit-jeans',
        brand: 'Generic Brand',
        category: 'Jeans',
        description: 'A pair of stylish and comfortable slim-fit jeans.',
        price: 49.99,
        listPrice: 69.99,
        countInStock: 20,
        tags: ['new arrival', 'denim'],
        colors: ['Blue', 'Black'],
        sizes: ['S', 'M', 'L'],
        avgRating: 4.2,
        numReviews: 12,
        numSales: 120,
        ratingDistribution: [
            { rating: 5, count: 6 },
            { rating: 4, count: 4 },
            { rating: 3, count: 2 },
        ],
        images: ['/images/jeans-front.jpg', '/images/jeans-back.jpg'],
        isPublished: true,
        reviews: [],
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-10T12:00:00Z'),
    },
    // Additional mock product to demonstrate filtering
    {
        _id: 'prod_mock_002',
        name: 'Running Shoes',
        slug: 'running-shoes',
        brand: 'Sports Co',
        category: 'Shoes',
        description: 'Comfortable shoes for running and jogging.',
        price: 89.99,
        listPrice: 99.99,
        countInStock: 15,
        tags: ['new arrival', 'sports'],
        colors: ['White', 'Black', 'Red'],
        sizes: ['7', '8', '9', '10'],
        avgRating: 4.5,
        numReviews: 8,
        numSales: 75,
        ratingDistribution: [
            { rating: 5, count: 5 },
            { rating: 4, count: 2 },
            { rating: 3, count: 1 },
        ],
        images: ['/images/shoes-front.jpg', '/images/shoes-side.jpg'],
        isPublished: true,
        reviews: [],
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-20T12:00:00Z'),
    },
    // T-Shirt product for additional category
    {
        _id: 'prod_mock_003',
        name: 'Cotton Graphic T-Shirt',
        slug: 'cotton-graphic-tshirt',
        brand: 'Fashion Brand',
        category: 'T-Shirts',
        description: 'A comfortable cotton t-shirt with graphic print.',
        price: 24.99,
        listPrice: 29.99,
        countInStock: 30,
        tags: ['new arrival', 'casual'],
        colors: ['White', 'Black', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
        avgRating: 4.7,
        numReviews: 15,
        numSales: 95,
        ratingDistribution: [
            { rating: 5, count: 12 },
            { rating: 4, count: 2 },
            { rating: 3, count: 1 },
        ],
        images: ['/images/tshirt-front.jpg', '/images/tshirt-back.jpg'],
        isPublished: true,
        reviews: [],
        createdAt: new Date('2024-02-01T10:00:00Z'),
        updatedAt: new Date('2024-02-10T12:00:00Z'),
    }
];