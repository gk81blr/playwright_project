import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

// Note: FakeStore does not persist changes. Update/delete of a newly created ID
// still return 200, and delete of a new ID returns an empty (null) body.

test.describe('CRUD Workflow API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_USER_ID = 1;

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        let productId = 0;

        await test.step('1) Create a product', async () => {
            const payload = RandomDataUtil.generateProductPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

            expect(response.status(), 'Create product should return 201').toBe(201);

            const created = await response.json();
            expect(created, 'Response should contain the submitted product').toMatchObject(payload);
            productId = created.id;
            expect(typeof productId, 'A product ID should be returned').toBe('number');
        });

        await test.step('2) Update the same product', async () => {
            const payload = RandomDataUtil.generateUpdatedProductPayload();
            const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;
            const response = await request.put(url, { data: payload });

            expect(response.status(), 'Update product should return 200').toBe(200);

            const updated = await response.json();
            expect(updated.id, 'Updated product ID should match the created ID').toBe(productId);
            expect(updated, 'Response should contain the updated values').toMatchObject(payload);
        });

        await test.step('3) Delete the same product', async () => {
            const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;
            const response = await request.delete(url);

            expect(response.status(), 'Delete product should return 200').toBe(200);
        });
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        let userId = 0;

        await test.step('1) Create a user', async () => {
            const payload = RandomDataUtil.generateUserPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

            expect(response.status(), 'Create user should return 201').toBe(201);

            const created = await response.json();
            userId = created.id;
            expect(typeof userId, 'A user ID should be returned').toBe('number');
        });

        await test.step('2) Update the same user', async () => {
            const payload = RandomDataUtil.generateUserUpdatePayload();
            const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;
            const response = await request.put(url, { data: payload });

            expect(response.status(), 'Update user should return 200').toBe(200);

            const updated = await response.json();
            expect(updated, 'Response should contain the updated user values').toMatchObject(payload);
        });

        await test.step('3) Delete the same user', async () => {
            const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;
            const response = await request.delete(url);

            expect(response.status(), 'Delete user should return 200').toBe(200);
        });
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @end-to-end @api', async ({ request }) => {
        let cartId = 0;
        const createPayload = RandomDataUtil.generateCartPayload(CART_USER_ID);

        await test.step('1) Create a cart', async () => {
            const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

            expect(response.status(), 'Create cart should return 201').toBe(201);

            const created = await response.json();
            cartId = created.id;
            expect(typeof cartId, 'A cart ID should be returned').toBe('number');
            expect(created.userId, 'Returned userId should match').toBe(CART_USER_ID);
            expect(created.products, 'Returned products should match').toEqual(createPayload.products);
        });

        await test.step('2) Update the same cart with a new quantity', async () => {
            const payload = RandomDataUtil.generateUpdatedCartPayload(CART_USER_ID);
            payload.products[0].productId = createPayload.products[0].productId;
            payload.products[0].quantity = createPayload.products[0].quantity + 1;

            const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;
            const response = await request.put(url, { data: payload });

            expect(response.status(), 'Update cart should return 200').toBe(200);

            const updated = await response.json();
            expect(updated.id, 'Updated cart ID should match the created ID').toBe(cartId);
            expect(updated.products[0].quantity, 'Product quantity should be updated')
                .toBe(createPayload.products[0].quantity + 1);
        });

        await test.step('3) Delete the same cart', async () => {
            const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;
            const response = await request.delete(url);

            expect(response.status(), 'Delete cart should return 200').toBe(200);
        });
    });
});
