import { type Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";

export default class SearchPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async closeOccupancyDialog(): Promise<void> {
        if (await this.occupancyDialogEle().isVisible()) {
            await this._page.locator("#occupancy-box").click();
        }
    }

    async selectPropertyFromThePropertiesList(index: number): Promise<void> {
        await this._page.locator("ol.hotel-list-container li.PropertyCard.PropertyCardItem").nth(index).locator("a[target='_blank']").click();
    }

    occupancyDialogEle(): Locator {
        return this._page.getByRole("dialog", { name: "Occupancy selection" });
    }
}