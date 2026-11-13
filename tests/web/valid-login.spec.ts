/**
 * Test Case: Valid Login
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Open My Account → Login and verify the login page
 * 3) Log in with the configured valid credentials
 * 4) Verify the My Account page and authenticated navigation
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Log in with valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify the My Account page is displayed', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists()).toBeTruthy();
    });

    console.log('✅ ✔️ Valid login completed successfully!');
});
