import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly headingShoppingCart: Locator;
    private readonly rowsCartProducts: Locator;
    private readonly rowCartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingShoppingCart = page.getByRole('heading', { name: /^Shopping Cart/, level: 1 });
        this.rowsCartProducts = page.locator('#shopping-cart tbody tr');
        this.rowCartTotal = page.locator('#checkout-total tr').filter({ has: page.locator('strong', { hasText: /^Total$/ }) });
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the Shopping Cart heading is visible
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            await this.headingShoppingCart.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether the given product is in the cart
     * @param productName - Product name
     * @returns Promise<boolean> - true if the product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            await this.productRow(productName).waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking product in cart: ${error}`);
            return false;
        }
    }

    /**
     * Gets the quantity of the given product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Quantity value
     */
    async getProductQuantity(productName: string): Promise<string> {
        return await this.productRow(productName).locator('input[name="quantity"]').inputValue();
    }

    /**
     * Gets the unit price of the given product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Unit price text, e.g. "$602.00"
     */
    async getUnitPrice(productName: string): Promise<string> {
        return ((await this.productRow(productName).getByRole('cell').nth(3).textContent()) ?? '').trim();
    }

    /**
     * Gets the cart Total amount
     * @returns Promise<string> - Total text, e.g. "$602.00"
     */
    async getCartTotal(): Promise<string> {
        return ((await this.rowCartTotal.locator('td').last().textContent()) ?? '').trim();
    }

    private productRow(productName: string): Locator {
        return this.rowsCartProducts.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }
}
