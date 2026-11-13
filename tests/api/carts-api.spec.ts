import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = 1;
    const UPDATE_CART_ID = 7;
    const DELETE_CART_ID = 6;
    const USER_ID = 2;
    const LIMIT = 3;
    const START_DATE = '2019-12-10';
    const END_DATE = '2020-10-10';

    // ---------------------------------------------------------
    // GET - Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Get all carts should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Cart list should not be empty').toBeGreaterThan(0);

        carts.forEach((cart: any) => {
            expect(typeof cart.id, 'Cart id should be a number').toBe('number');
            expect(typeof cart.userId, `Cart ${cart.id} userId should be a number`).toBe('number');
            expect(Array.isArray(cart.products), `Cart ${cart.id} products should be an array`).toBeTruthy();
        });
    });

    test('GET - Cart By ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get cart by ID should return 200').toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Returned ID should match the requested ID').toBe(CART_ID);
        expect(cart.products.length, 'Cart should contain products').toBeGreaterThan(0);
    });

    test('GET - Carts By Date Range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;
        const response = await request.get(url);

        expect(response.status(), 'Get carts by date range should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, 'Date range should contain carts').toBeGreaterThan(0);

        // Cart dates are returned as ISO strings, e.g. "2020-03-02T00:00:00.000Z"
        carts.forEach((cart: any) => {
            const cartDate = cart.date.split('T')[0];
            expect(cartDate >= START_DATE && cartDate <= END_DATE,
                `Cart ${cart.id} date ${cartDate} should be between ${START_DATE} and ${END_DATE}`).toBeTruthy();
        });
    });

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get user cart should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, `User ${USER_ID} should have carts`).toBeGreaterThan(0);

        carts.forEach((cart: any) => {
            expect(cart.userId, `Cart ${cart.id} should belong to user ${USER_ID}`).toBe(USER_ID);
        });
    });

    test('GET - Carts With Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get carts with limit should return 200').toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts), 'Response should be an array').toBeTruthy();
        expect(carts.length, `Cart count should be ${LIMIT}`).toBe(LIMIT);
    });

    for (const order of ['asc', 'desc']) {
        test(`GET - Carts Sorted ${order === 'asc' ? 'Ascending' : 'Descending'} @master @regression @api`, async ({ request }) => {

            const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', order)}`;
            const response = await request.get(url);

            expect(response.status(), 'Get sorted carts should return 200').toBe(200);

            const ids: number[] = (await response.json()).map((cart: any) => cart.id);
            const expectedIds = [...ids].sort((a, b) => (order === 'asc' ? a - b : b - a));

            expect(ids, `Cart IDs should be in ${order} order`).toEqual(expectedIds);
        });
    }

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Create cart should return 201').toBe(201);

        const created = await response.json();

        expect(typeof created.id, 'A cart ID should be returned').toBe('number');
        expect(created.userId, 'Returned userId should match').toBe(USER_ID);
        expect(created.products, 'Returned products should match').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(UPDATE_CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update cart should return 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned ID should match the requested ID').toBe(UPDATE_CART_ID);
        expect(updated.products[0].quantity, 'Product quantity should be updated')
            .toBe(payload.products[0].quantity);
        expect(updated, 'Response should contain the updated values').toMatchObject(payload);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(DELETE_CART_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Delete cart should return 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted cart ID should match the requested ID').toBe(DELETE_CART_ID);
    });
});
