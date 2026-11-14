/**
 * Test Case: User Registration
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Open My Account → Register and verify the registration page
 * 3) Fill the form with unique random data, accept the Privacy Policy and submit
 * 4) Verify the "Your Account Has Been Created!" confirmation
 * 5) Verify the new account is reachable through My Account
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration test @master @sanity @regression @web', async ({ homePage, registrationPage, myAccountPage }) => {
    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(),
    };

    await test.step('1) Navigate to the registration page', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        expect(await registrationPage.isRegistrationPageExists()).toBeTruthy();
    });

    await test.step('2) Fill and submit the registration form', async () => {
        await registrationPage.completeRegistration(userData);
    });

    await test.step('3) Verify the account-created confirmation', async () => {
        const confirmationMsg = await registrationPage.getConfirmationMsg();
        expect(confirmationMsg).toBe('Your Account Has Been Created!');
    });

    await test.step('4) Verify the new account is available in My Account', async () => {
        await registrationPage.clickContinueAfterRegistration();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        expect(await homePage.isLogoutLinkExists()).toBeTruthy();
    });

    console.log('✅ ✔️ User registration completed successfully!');
});
