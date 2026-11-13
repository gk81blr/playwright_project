/**
 * Test Case: Invalid Login
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Open My Account → Login
 * 3) Log in with a random (unregistered) email and password
 * 4) Verify the warning message and that the user is not authenticated
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid login test @master @regression @web', async ({ homePage, loginPage, page }) => {
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    await test.step('1) Navigate to the login page', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Log in with invalid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify the warning and that the user is not authenticated', async () => {
        const errorMessage = await loginPage.getLoginErrorMessage();
        expect(errorMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
        expect(page.url()).toContain('route=account/login');
        await homePage.clickMyAccount();
        expect(await homePage.isLoginLinkExists()).toBeTruthy();
        expect(await homePage.isLogoutLinkExists()).toBeFalsy();
    });

    console.log('✅ ✔️ Invalid login rejected as expected!');
});
