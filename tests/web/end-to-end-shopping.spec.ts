/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @end-to-end @web
 *
 * Steps:
 * 1) Register a new customer with random data
 * 2) Log out
 * 3) Log in again with the new credentials
 * 4) Search for a known product and open it
 * 5) Add the product to the cart
 * 6) Verify product, quantity, unit price and cart total
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping test @master @end-to-end @web', async ({
    homePage, registrationPage, loginPage, myAccountPage, logoutPage, searchResultsPage, productPage, shoppingCartPage,
}) => {
    // Long multi-page journey: triple the default 30s timeout
    test.slow();

    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        password: RandomDataUtil.getPassword(),
    };
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registrationPage.completeRegistration(userData);
        expect(await registrationPage.getConfirmationMsg()).toBe('Your Account Has Been Created!');
    });

    await test.step('2) Log out', async () => {
        await registrationPage.clickContinueAfterRegistration();
        await myAccountPage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('3) Log in again with the new credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(userData.email, userData.password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('4) Search and open the product', async () => {
        await homePage.enterProductName(productName);
        await homePage.clickSearch();
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.isProductPageExists(productName)).toBeTruthy();
    });

    await test.step('5) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        expect(await productPage.getConfirmationMessage()).toContain(`Success: You have added ${productName}`);
    });

    await test.step('6) Verify the shopping cart', async () => {
        await homePage.clickShoppingCart();
        expect(await shoppingCartPage.isProductInCart(productName)).toBeTruthy();
        expect(await shoppingCartPage.getProductQuantity(productName)).toBe(productQuantity);
        expect(await shoppingCartPage.getUnitPrice(productName)).toBe(totalPrice);
        expect(Helper.convertPriceToNumber(await shoppingCartPage.getCartTotal())).toBe(Helper.convertPriceToNumber(totalPrice));
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
