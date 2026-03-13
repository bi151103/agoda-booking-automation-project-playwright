import { type Page } from "@playwright/test";
import BasePage from "./basePage";

export default class SearchPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
}