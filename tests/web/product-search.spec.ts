/**
 * Test Case: Product Search
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Search for a known product
 * 3) Verify the search results page and the expected product
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search test @master @sanity @regression @web', async ({ homePage, searchResultsPage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Search for the product', async () => {
        await homePage.enterProductName(productName);
        await homePage.clickSearch();
    });

    await test.step('2) Verify the search results', async () => {
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await searchResultsPage.isProductExist(productName)).toBeTruthy();
        const productNames = await searchResultsPage.getProductNames();
        expect(productNames).toContain(productName);
        for (const name of productNames) {
            expect(name.toLowerCase()).toContain(productName.toLowerCase());
        }
    });

    console.log('✅ ✔️ Product search completed successfully!');
});
