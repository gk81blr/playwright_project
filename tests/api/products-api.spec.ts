import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = 1;
    const UPDATE_PRODUCT_ID = 7;
    const DELETE_PRODUCT_ID = 6;
    const LIMIT = 5;
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Get all products should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Product list should not be empty').toBeGreaterThan(0);

        products.forEach((product: any) => {
            expect(typeof product.id, `Product id should be a number`).toBe('number');
            expect(typeof product.title, `Product ${product.id} title should be a string`).toBe('string');
            expect(typeof product.price, `Product ${product.id} price should be a number`).toBe('number');
            expect(typeof product.category, `Product ${product.id} category should be a string`).toBe('string');
            expect(product.image, `Product ${product.id} image should be a URL`).toMatch(/^https?:\/\//);
        });
    });

    test('GET - Product By ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get product by ID should return 200').toBe(200);

        const product = await response.json();

        expect(product.id, 'Returned ID should match the requested ID').toBe(PRODUCT_ID);
        expect(product.title, 'Product title should not be empty').toBeTruthy();
        expect(product.price, 'Product price should be greater than 0').toBeGreaterThan(0);
        expect(product.category, 'Product category should not be empty').toBeTruthy();
        expect(product.image, 'Product image should be a URL').toMatch(/^https?:\/\//);
    });

    test('GET - Products With Limit @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get products with limit should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, `Product count should be ${LIMIT}`).toBe(LIMIT);
    });

    test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Get sorted products should return 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: any) => product.id);
        const expectedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Product IDs should be in ascending order').toEqual(expectedIds);
    });

    test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status(), 'Get sorted products should return 200').toBe(200);

        const ids: number[] = (await response.json()).map((product: any) => product.id);
        const expectedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Product IDs should be in descending order').toEqual(expectedIds);
    });

    test('GET - All Product Categories @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Get all categories should return 200').toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories), 'Response should be an array').toBeTruthy();
        expect(categories.length, 'Category list should not be empty').toBeGreaterThan(0);
        expect(categories, `Categories should include "${CATEGORY}"`).toContain(CATEGORY);
    });

    test('GET - Products By Category @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`;
        const response = await request.get(url);

        expect(response.status(), 'Get products by category should return 200').toBe(200);

        const products = await response.json();

        expect(Array.isArray(products), 'Response should be an array').toBeTruthy();
        expect(products.length, 'Category should contain products').toBeGreaterThan(0);

        products.forEach((product: any) => {
            expect(product.category, `Product ${product.id} should belong to "${CATEGORY}"`).toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Create product should return 201').toBe(201);

        const created = await response.json();

        expect(typeof created.id, 'A product ID should be returned').toBe('number');
        expect(created, 'Response should contain the submitted product data').toMatchObject(payload);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(UPDATE_PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Update product should return 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned ID should match the requested ID').toBe(UPDATE_PRODUCT_ID);
        expect(updated, 'Response should contain the updated values').toMatchObject(payload);
        expect(updated.title.startsWith('Updated '), 'Title should start with "Updated "').toBeTruthy();
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(DELETE_PRODUCT_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Delete product should return 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted product ID should match the requested ID').toBe(DELETE_PRODUCT_ID);
    });
});
