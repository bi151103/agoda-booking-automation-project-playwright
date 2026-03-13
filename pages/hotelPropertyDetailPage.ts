import { type Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";

export default class HotelPropertyDetailPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    displayedPriceEle(): Locator {
        return this._page.locator("#hotelNavBar").locator('.StickyNavPrice__priceDetail');
    }
}