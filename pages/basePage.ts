import { type Page } from "@playwright/test";

export default abstract class BasePage {
    protected _page: Page;
    constructor(page: Page) {
        this._page = page;
    }
}