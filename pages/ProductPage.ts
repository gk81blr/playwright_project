import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProductName: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly msgSuccess: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProductName = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.msgSuccess = page.locator('#alert .alert-success');
    }

    /**
     * Verifies the product details page for the given product is displayed
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product heading matches
     */
    async isProductPageExists(productName: string): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=product\/product/);
            await this.headingProductName.waitFor({ state: 'visible' });
            return ((await this.headingProductName.textContent()) ?? '').trim() === productName;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Sets the quantity
     * @param quantity - Quantity to add
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Gets the success message shown after adding the product to the cart
     * @returns Promise<string> - Success message text
     */
    async getConfirmationMessage(): Promise<string> {
        await this.msgSuccess.waitFor({ state: 'visible' });
        return ((await this.msgSuccess.textContent()) ?? '').trim();
    }
}
