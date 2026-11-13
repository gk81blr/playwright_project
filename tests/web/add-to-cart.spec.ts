/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Search for a known product and open its details page
 * 3) Set the quantity and click Add to Cart
 * 4) Verify the success message
 * 5) Open the shopping cart and verify the product and quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @regression @web', async ({ homePage, searchResultsPage, productPage, shoppingCartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search and open the product', async () => {
        await homePage.enterProductName(productName);
        await homePage.clickSearch();
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.isProductPageExists(productName)).toBeTruthy();
    });

    await test.step('2) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        const confirmationMsg = await productPage.getConfirmationMessage();
        expect(confirmationMsg).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('3) Verify the product in the shopping cart', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await shoppingCartPage.isProductInCart(productName)).toBeTruthy();
        expect(await shoppingCartPage.getProductQuantity(productName)).toBe(productQuantity);
    });

    console.log('✅ ✔️ Product added to cart successfully!');
});
