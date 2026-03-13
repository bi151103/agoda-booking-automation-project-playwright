import HomePage from '@pages/homePage';
import { test as base } from '@playwright/test';

export type CustomFixture = {
    homePage: HomePage;
}

export const test = base.extend<CustomFixture>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    }
});

export { expect } from '@playwright/test';