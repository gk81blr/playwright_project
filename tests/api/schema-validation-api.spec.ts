import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = 1;
    const USER_ID = 1;
    const CART_ID = 1;

    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // GET - Product Schema
    // ---------------------------------------------------------

    test('GET - Product Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get product by ID should return 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        if (!isValid) {
            console.log('Product schema errors:', validate.errors);
        }
        expect(isValid, `Product schema errors: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - User Schema
    // ---------------------------------------------------------

    test('GET - User Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get user by ID should return 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        if (!isValid) {
            console.log('User schema errors:', validate.errors);
        }
        expect(isValid, `User schema errors: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Cart Schema
    // ---------------------------------------------------------

    test('GET - Cart Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status(), 'Get cart by ID should return 200').toBe(200);

        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(await response.json());

        if (!isValid) {
            console.log('Cart schema errors:', validate.errors);
        }
        expect(isValid, `Cart schema errors: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });
});
