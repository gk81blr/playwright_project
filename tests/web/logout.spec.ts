/**
 * Test Case: Logout
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Log in with the configured valid credentials
 * 3) Click Logout and verify the logout page
 * 4) Click Continue and verify the home page
 * 5) Verify authenticated account options are no longer available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('User logout test @master @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Log in with valid credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('2) Log out', async () => {
        await myAccountPage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('3) Continue to the home page', async () => {
        await logoutPage.clickContinue();
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('4) Verify authenticated options are gone', async () => {
        await homePage.clickMyAccount();
        expect(await homePage.isLoginLinkExists()).toBeTruthy();
        expect(await homePage.isLogoutLinkExists()).toBeFalsy();
    });

    console.log('✅ ✔️ Logout completed successfully!');
});
