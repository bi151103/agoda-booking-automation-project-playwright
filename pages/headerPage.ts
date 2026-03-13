import { type Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";

export default class HeaderPage extends BasePage {
    private _logoEle: Locator;
    constructor(page: Page) {
        super(page);

        this._logoEle = this._page.getByLabel("Agoda logo Home link");
    }

    async clickOnLogo(): Promise<void> {
        this._logoEle.click();
    }
}