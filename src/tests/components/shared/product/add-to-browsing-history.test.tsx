import React from 'react';
import {render} from '@testing-library/react';
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history';
import useBrowsingHistory from '@/hooks/use-browsing-history';

// Mock the useBrowsingHistory hook
jest.mock('@/hooks/use-browsing-history');

const mockAddItem = jest.fn();

describe('AddToBrowsingHistory', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock implementation of the hook
        (useBrowsingHistory as jest.Mock).mockReturnValue({
            addItem: mockAddItem,
        });
    });

    it('should call addItem with correct parameters when mounted', () => {
        const testId = 'product-123';
        const testCategory = 'electronics';

        render(<AddToBrowsingHistory id={testId} category={testCategory}/>);

        expect(mockAddItem).toHaveBeenCalledTimes(1);
        expect(mockAddItem).toHaveBeenCalledWith({
            id: testId,
            category: testCategory
        });
    });

    it('should only call addItem once even on re-renders', () => {
        const {rerender} = render(
            <AddToBrowsingHistory id="product-123" category="electronics"/>
        );

        // Re-render with same props
        rerender(<AddToBrowsingHistory id="product-123" category="electronics"/>);

        // Re-render with different props
        rerender(<AddToBrowsingHistory id="product-456" category="clothing"/>);

        expect(mockAddItem).toHaveBeenCalledTimes(1); // Still only called once
    });


    it('should return null and render nothing', () => {
        const {container} = render(
            <AddToBrowsingHistory id="product-123" category="electronics"/>
        );

        expect(container.firstChild).toBeNull();
    });

});