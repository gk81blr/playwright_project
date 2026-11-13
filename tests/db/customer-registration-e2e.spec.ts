/**
 * Test Case: Customer Registration – Frontend UI + Admin Portal + MySQL
 *
 * Tags: @master @end-to-end @db
 *
 * Steps:
 * 1) Register a new customer with unique random data through the frontend
 * 2) Log in to the Admin Portal, search the customer by email and verify the details
 * 3) Query oc_customer by email and verify the stored record
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';

dotenv.config();

type CustomerRow = {
    customer_id: number;
    firstname: string;
    lastname: string;
    email: string;
    status: number;
    date_added: Date | null;
};

const ADMIN_URL = process.env.ADMIN_APP_URL || 'http://localhost/opencart/upload/admin/index.php';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// A customer registered through the storefront is enabled (status = 1)
const EXPECTED_STATUS = 1;

test('Customer registration verified in UI, Admin and DB @master @end-to-end @db', async ({
    homePage, registrationPage, adminLoginPage, adminDashboardPage, adminCustomersPage, adminCustomerEditPage,
}) => {
    // UI + Admin + DB journey: triple the default 30s timeout
    test.slow();

    // Step 1 data: generated once and reused in every layer
    // Note: this OpenCart 4 register form has no Telephone or Password Confirm fields.
    // Names keep letters only: OpenCart stores characters like ' as HTML entities (&#039;) in the DB.
    const customer = {
        firstName: RandomDataUtil.getFirstName().replace(/[^A-Za-z]/g, ''),
        lastName: RandomDataUtil.getLastName().replace(/[^A-Za-z]/g, ''),
        email: `${Date.now()}_${RandomDataUtil.getEmail()}`.toLowerCase(),
        password: RandomDataUtil.getPassword(),
    };

    await test.step('1) Register the customer through the frontend', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        expect(await registrationPage.isRegistrationPageExists(), 'Registration page should be displayed').toBeTruthy();

        await registrationPage.completeRegistration(customer);

        const confirmationMsg = await registrationPage.getConfirmationMsg();
        expect(confirmationMsg, 'Account-created confirmation should be displayed').toBe('Your Account Has Been Created!');
    });

    await test.step('2) Verify the customer in the Admin Portal', async () => {
        await adminLoginPage.navigateToAdminPortal(ADMIN_URL);
        expect(await adminLoginPage.isAdminLoginPageExists(), 'Admin login page should be displayed').toBeTruthy();

        await adminLoginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
        expect(await adminDashboardPage.isDashboardPageExists(), 'Admin login should open the dashboard').toBeTruthy();
        await adminDashboardPage.closeSecurityNotificationIfPresent();

        await adminDashboardPage.navigateToCustomers();
        expect(await adminCustomersPage.isCustomersPageExists(), 'Customers page should be displayed').toBeTruthy();

        await adminCustomersPage.filterByEmail(customer.email);
        expect(await adminCustomersPage.isCustomerExists(customer.email), 'Customer should be listed in Admin').toBeTruthy();
        expect(await adminCustomersPage.getCustomerCount(), 'Exactly one customer should match the email').toBe(1);
        expect(await adminCustomersPage.getCustomerName(customer.email), 'Admin list name should match')
            .toBe(`${customer.firstName} ${customer.lastName}`);

        await adminCustomersPage.clickEditCustomer(customer.email);
        expect(await adminCustomerEditPage.isEditCustomerPageExists(), 'Customer edit form should be displayed').toBeTruthy();
        expect(await adminCustomerEditPage.getFirstName(), 'Admin first name should match').toBe(customer.firstName);
        expect(await adminCustomerEditPage.getLastName(), 'Admin last name should match').toBe(customer.lastName);
        expect(await adminCustomerEditPage.getEmail(), 'Admin email should match').toBe(customer.email);
        expect(await adminCustomerEditPage.isStatusEnabled(), 'Admin status should be Enabled').toBeTruthy();
    });

    await test.step('3) Verify the customer in the oc_customer table', async () => {
        // executeQuery opens and always closes its own connection
        const rows = (await executeQuery(
            'SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
            [customer.email],
        )) as CustomerRow[];

        expect(rows.length, 'Exactly one oc_customer row should match the email').toBe(1);

        const row = rows[0];
        expect(row.firstname, 'DB firstname should match').toBe(customer.firstName);
        expect(row.lastname, 'DB lastname should match').toBe(customer.lastName);
        expect(row.email, 'DB email should match').toBe(customer.email);
        expect(Number(row.status), 'DB status should be enabled (1)').toBe(EXPECTED_STATUS);
        expect(row.date_added, 'DB date_added should be set').toBeTruthy();
        expect(Number.isNaN(new Date(row.date_added as Date).getTime()), 'DB date_added should be a valid date').toBeFalsy();
    });

    console.log(`✅ ✔️ Customer ${customer.email} verified in UI, Admin and DB!`);
});
