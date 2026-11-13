import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Auth API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.API_USERNAME || '';
    const PASSWORD = process.env.API_PASSWORD || '';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status(), 'Valid login should return 201').toBe(201);

        const responseBody = await response.json();

        expect(responseBody, 'Response should contain a token').toHaveProperty('token');
        expect(typeof responseBody.token, 'Token should be a string').toBe('string');
        expect(responseBody.token.length, 'Token should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

        expect(response.status(), 'Invalid login should return 401').toBe(401);

        // The API returns the error as plain text, not JSON
        const errorMessage = await response.text();

        expect(errorMessage, 'Error message should match').toBe('username or password is incorrect');
    });
});
