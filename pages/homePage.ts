import { type Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";
import HeaderPage from "./headerPage";

export default class HomePage extends BasePage {
    private _headerPage?: HeaderPage;

    constructor(page: Page) {
        super(page);

    }

    private headerPage(): HeaderPage {
        if (!this._headerPage) {
            return new HeaderPage(this._page);
        }
        return this._headerPage;
    }

    async navigateTo(path?: string): Promise<void> {
        await this._page.goto(path ?? '');

        //add a loop to check if the 'Save 10% on your 1st app booking!' dialog is shown or the page fails to load the content and shows only header and footer
            //if the page fails to load the content, reload the page by clicking on the Agoda logo
        while(!await this._page.locator("#home-react-root #HomeReactContainer").isVisible()) {
            this.headerPage().clickOnLogo();
        }
    }

    async closeThe10PercentsBookingDialog(): Promise<void> {
        await this._page.getByRole("button", { name: "Close" }).click();
    }

    async selectHotelTabInTheFilter(): Promise<void> {
        if (!await this.holelTabInSelectedStateEle().isVisible()) {
            await this._page.getByRole("tab", { name: "Hotels", exact: true }).click();
        }
    }

    async selectOvernightAndStaysOptionsInHotelTab(): Promise<void> {
        if (!await this.overnightAndStaysButtonInSelectedStateEle().isVisible()) {
            await this._page.getByRole("button", { name: "Overnight Stays" }).click();
        }
    }

    async fillInDestionationAndPropertyInputInHolelTab(input: string): Promise<void> {
        const destinationAndPropertyInputEle = this.destinationAndPropertyInputEle();
        await destinationAndPropertyInputEle.click();
        await destinationAndPropertyInputEle.pressSequentially(input, { delay: 100 });
    }

    async closeTheDestionationSearchDialog(): Promise<void> {
        if (await this._page.locator("#search-box-autocomplete-id").isVisible()) {
            const destinationAndPropertyInputEle = this.destinationAndPropertyInputEle();

            const destinationInputEleBoundingBox = await destinationAndPropertyInputEle.boundingBox();
            if (!destinationInputEleBoundingBox) {
                throw new Error("destinationInputEleBoundingBox is null");
            }
            //click outside the destionation search dialog to close
            await destinationAndPropertyInputEle.click({ position: { x: destinationInputEleBoundingBox.x + destinationInputEleBoundingBox.width + 50, y: destinationInputEleBoundingBox.y }, force: true });
        }
    }

    async selectCheckInDate(monthToSelect: string, dayToSelect: string = "1"): Promise<void> {
        if (!(await this.checkInDatePickerDialogEle().isVisible() && await this.checkInDateInputInExpandedStateEle().isVisible())) {
            await this.checkInDateInputEle().click();
        }
        await this._page.locator(".DayPicker-Month").filter({ hasText: monthToSelect }).getByRole("button", { name: dayToSelect }).click();
    }
    
    async selectCheckOutDate(monthToSelect: string, dayToSelect: string): Promise<void> {
        if (!(await this.checkOutDatePickerDialogEle().isVisible() && await this.checkOutDateInputInExpandedStateEle().isVisible())) {
            await this.checkOutDateInputEle().click();
        }
        await this._page.locator(".DayPicker-Month").filter({ hasText: monthToSelect }).getByRole("button", { name: dayToSelect }).click();
    }

    async selectNumberOfRoomsInOccupancyDialog(numberOfRooms: number): Promise<void> {
        try {
            await this.occupancyDialogEle().waitFor({ state: "visible", timeout: 1000 });
        }
        catch (e) {
            await this._page.locator("#occupancy-box").click();
        }
        const currentNumberOfRooms = parseInt(await this.numberOfRoomsInOccupancyDialogEle().textContent() as unknown as string);
        if (!(currentNumberOfRooms === numberOfRooms)) {
            const numberOfSteps = Math.abs(currentNumberOfRooms - numberOfRooms);
            if (currentNumberOfRooms < numberOfRooms) {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Add Rooms" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Add Room", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Add Rooms" }).click();
                    }
                }
            }
            else {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Subtract Rooms" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Subtract Room", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Subtract Rooms" }).click();
                    }
                }
            }
        }
    }

    async selectNumberOfAdultsInOccupationDialog(numberOfAdults: number): Promise<void> {
        try {
            await this.occupancyDialogEle().waitFor({ state: "visible", timeout: 1000 });
        }
        catch (e) {
            await this._page.locator("#occupancy-box").click();
        }
        const currentNumberOfAdults = parseInt(await this.numberOfAdultsInOccupancyDialogEle().textContent() as unknown as string);
        if (!(currentNumberOfAdults === numberOfAdults)) {
            const numberOfSteps = Math.abs(currentNumberOfAdults - numberOfAdults);
            if (currentNumberOfAdults < numberOfAdults) {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Add Adults" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Add Adult", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Add Adults" }).click();
                    }
                }
            }
            else {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Subtract Adults" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Subtract Adult", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Subtract Adults" }).click();
                    }
                }
            }
        }
    }

    async selectNumberOfChildrenInOccupationDialog(numberOfChildren: number): Promise<void> {
        try {
            await this.occupancyDialogEle().waitFor({ state: "visible", timeout: 1000 });
        }
        catch (e) {
            await this._page.locator("#occupancy-box").click();
        }
        const currentNumberOfChildren = parseInt(await this.numberOfChildrenInOccupancyDialogEle().textContent() as unknown as string);
        if (!(currentNumberOfChildren === numberOfChildren)) {
            const numberOfSteps = Math.abs(currentNumberOfChildren - numberOfChildren);
            if (currentNumberOfChildren < numberOfChildren) {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Add Children" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Add Child", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Add Children" }).click();
                    }
                }
            }
            else {
                for (let i = 0; i < numberOfSteps; i++) {
                    if (!await this.occupancyDialogEle().getByRole("button", { name: "Subtract Children" }).isVisible()) {
                        await this._page.getByRole("button", { name: "Subtract Child", exact: true }).click();
                    }
                    else {
                        await this._page.getByRole("button", { name: "Subtract Children" }).click();
                    }
                }
            }
        }
    }

    async closeOccupancyDialog(): Promise<void> {
        await this._page.locator("#occupancy-box").click();
    }

    async submitTheFilter(): Promise<void> {
        await this._page.getByRole("button").filter({ hasText: "SEARCH" }).click();
    }

    save10PercentsBookingDialogTitleEle(): Locator {
        return this._page.getByText("Save 10% on your 1st app booking!");
    }

    holelTabInSelectedStateEle(): Locator {
        return this._page.getByRole("tab", { name: "Hotels", selected: true, exact: true });
    }

    overnightAndStaysButtonInSelectedStateEle(): Locator {
        return this._page.getByRole("button", { name: "Overnight Stays", pressed: true });
    }

    destinationAndPropertyInputEle(): Locator {
        return this._page.getByPlaceholder("Enter a destination or property");
    }

    checkInDatePickerDialogEle(): Locator {
        return this._page.getByRole("dialog", { name: "Check In Date Picker" } );
    }

    checkOutDatePickerDialogEle(): Locator {
        return this._page.getByRole("dialog", { name: "Check Out Date Picker" } );
    }

    checkInDateInputEle(): Locator {
        return this._page.locator("#check-in-box");
    }

    checkOutDateInputEle(): Locator {
        return this._page.locator("#check-out-box");
    }

    checkInDateInputInExpandedStateEle(): Locator {
        return this._page.getByRole("button", { name: "Check-in", expanded: true });
    }
    
    checkOutDateInputInExpandedStateEle(): Locator {
        return this._page.getByRole("button", { name: "Check-out", expanded: true });
    }

    occupancyDialogEle(): Locator {
        return this._page.getByRole("dialog", { name: "Occupancy selection" });
    }

    numberOfRoomsInOccupancyDialogEle(): Locator {
        return this.occupancyDialogEle().locator("div[data-selenium='occupancyRooms'] div[data-selenium='desktop-occ-room-value']");
    }

    numberOfAdultsInOccupancyDialogEle(): Locator {
        return this.occupancyDialogEle().locator("div[data-selenium='occupancyAdults']");
    }

    numberOfChildrenInOccupancyDialogEle(): Locator {
        return this.occupancyDialogEle().locator("div[data-selenium='occupancyChildren']");
    }
}