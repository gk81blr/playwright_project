import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = 1;
    const UPDATE_USER_ID = 7;
    const DELETE_USER_ID = 6;
    const LIMIT = 3;

    // ---------------------------------------------------------
    // GET - Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'Get all users should return 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, 'User list should not be empty').toBeGreaterThan(0);

        users.forEach((user: any) => {
            expect(typeof user.id, 'User id should be a number').toBe('number');
            expect(user.email, `User ${user.id} email should contain @`).toContain('@');
            expect(user.username, `User ${user.id} username should not be empty`).toBeTruthy();
        });
    });

    test('GET - User By ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get user by ID should return 200').toBe(200);

        const user = await response.json();

        expect(user.id, 'Returned ID should match the requested ID').toBe(USER_ID);
        expect(user.email, 'User email should contain @').toContain('@');
        expect(user.name.firstname, 'User first name should not be empty').toBeTruthy();
    });

    test('GET - Users With Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get users with limit should return 200').toBe(200);

        const users = await response.json();

        expect(Array.isArray(users), 'Response should be an array').toBeTruthy();
        expect(users.length, `User count should be ${LIMIT}`).toBe(LIMIT);
    });

    for (const order of ['asc', 'desc']) {
        test(`GET - Users Sorted ${order === 'asc' ? 'Ascending' : 'Descending'} @master @regression @api`, async ({ request }) => {

            const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', order)}`;
            const response = await request.get(url);

            expect(response.status(), 'Get sorted users should return 200').toBe(200);

            const ids: number[] = (await response.json()).map((user: any) => user.id);
            const expectedIds = [...ids].sort((a, b) => (order === 'asc' ? a - b : b - a));

            expect(ids, `User IDs should be in ${order} order`).toEqual(expectedIds);
        });
    }

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Create user should return 201').toBe(201);

        const created = await response.json();

        // The API only returns the generated ID for a new user
        expect(typeof created.id, 'A user ID should be returned').toBe('number');
        expect(created.id, 'User ID should be greater than 0').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();
        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(UPDATE_USER_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update user should return 200').toBe(200);

        const updated = await response.json();

        expect(updated, 'Response should contain the updated values').toMatchObject(payload);
        expect(updated.username.startsWith('updated-'), 'Username should start with "updated-"').toBeTruthy();
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(DELETE_USER_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Delete user should return 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted user ID should match the requested ID').toBe(DELETE_USER_ID);
    });
});
