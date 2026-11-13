/**
 * Test Case: Login (Data Driven)
 *
 * Tags: @master @datadriven @web
 *
 * Steps (one test per row of testdata/opencart_logindata.json):
 * 1) Navigate to the application URL and open the login page
 * 2) Enter the email and password (blank values are left empty)
 * 3) Submit the login form
 * 4) Validate the result against the row's "expected" value
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginData = {
    testName: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
};

const loginData: LoginData[] = DataProvider.readJson('testdata/opencart_logindata.json');

for (const data of loginData) {
    test(`Login data driven test - ${data.testName} @master @datadriven @web`, async ({ homePage, loginPage, myAccountPage }) => {
        await test.step('1) Navigate to the login page', async () => {
            await homePage.clickMyAccount();
            await homePage.clickLogin();
            expect(await loginPage.isLoginPageExists()).toBeTruthy();
        });

        await test.step('2) Submit the login form', async () => {
            await loginPage.login(data.email.trim(), data.password.trim());
        });

        await test.step(`3) Verify the login result is "${data.expected}"`, async () => {
            if (data.expected === 'success') {
                expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
            } else {
                // OpenCart counts failed attempts per email and locks that email for 1 hour after 5 failures,
                // so repeated runs can get the lockout warning instead of the "No match" warning.
                const errorMessage = await loginPage.getLoginErrorMessage();
                expect(errorMessage).toMatch(
                    /Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\.)/
                );
                expect(await loginPage.isLoginPageExists()).toBeTruthy();
            }
        });

        console.log(`✅ ✔️ ${data.testName} completed successfully!`);
    });
}
