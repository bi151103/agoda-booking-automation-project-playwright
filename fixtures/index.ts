import HomePage from '@pages/homePage';
import SearchPage from '@pages/searchPage';
import { test as base } from '@playwright/test';

export type CustomFixture = {
    homePage: HomePage;
    searchPage: SearchPage;
}

export const test = base.extend<CustomFixture>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
});

export { expect } from '@playwright/test';