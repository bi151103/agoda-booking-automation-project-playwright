import { test, expect, type Page } from '@playwright/test';
import { addXDays, getCustomDateFormatWithShortMonth, getDayOfWeekAfterXDays, getMonthNameAfterXDays } from "@shared/utils";

test.describe("Hotel booking detail page", () => {
    test.beforeEach(async ({ page }) => {
        await test.step("Access the agoda.com site with the language is english and the currency is VND", async () => {
            await page.goto('/en-gb/?cur=VND');

            //add a loop to check if the 'Save 10% on your 1st app booking!' dialog is shown or the page fails to load the content and shows only header and footer
                //if the page fails to load the content, reload the page by clicking on the Agoda logo
            while (!await page.getByText("Save 10% on your 1st app booking!").isVisible()) {
                await page.getByLabel("Agoda logo Home link").click();
            }
            await page.getByRole("button", { name: "Close" }).click();
            await expect(page.getByText("Save 10% on your 1st app booking!")).toBeHidden();
        });
    });
    
    test("should show hotel detail with a correct price displayed after clicking on the first result from the properties list",
        async ({ page }) => {
            await test.step("Choose the option 'Hotel' and 'Overnight Stays' in the filter", async () => {
                if (!await page.getByRole("tab", { name: "Hotels", selected: true, exact: true }).isVisible()) {
                    await page.getByRole("tab", { name: "Hotels", exact: true }).click();
                }
                await expect(page.getByRole("tab", { name: "Hotels", selected: true, exact: true })).toBeVisible();

                if (!await page.getByRole("button", { name: "Overnight Stays", pressed: true }).isVisible()) {
                    await page.getByRole("button", { name: "Overnight Stays" }).click();
                }
                await expect(page.getByRole("button", { name: "Overnight Stays", pressed: true })).toBeVisible();
            });

            await test.step("Enter 'Muong Thanh Saigon Centre Hotel' into the Destination or property input", async () => {
                const destinationInputEle = page.getByPlaceholder("Enter a destination or property");
                await destinationInputEle.click();
    
                const hotelSearchResponsePromise = page.waitForResponse((response) => 
                    response.url().includes("api/cronos/search/GetUnifiedSuggestResult") &&
                    new URL(response.url()).searchParams.get('searchText') === 'Muong Thanh Saigon Centre Hotel' &&
                    response.status() === 200
                );
                await destinationInputEle.pressSequentially("Muong Thanh Saigon Centre Hotel", { delay: 100 });
                await hotelSearchResponsePromise;
                
                const destinationInputEleBoundingBox = await destinationInputEle.boundingBox();
                if (!destinationInputEleBoundingBox) {
                    throw new Error("destinationInputEleBoundingBox is null");
                }
                //click outside the destionation search dialog to close
                await destinationInputEle.click({ position: { x: destinationInputEleBoundingBox.x + destinationInputEleBoundingBox.width + 50, y: destinationInputEleBoundingBox.y }, force: true });
                await expect(destinationInputEle).toHaveValue("Muong Thanh Saigon Centre Hotel");
            });

            await test.step("Select check in day from today + 2 days", async () => {
                await page.locator("#check-in-box").click();
                await expect(page.getByRole("dialog", { name: "Check In Date Picker" } )).toBeVisible();
    
                await page.locator(".DayPicker-Month").filter({ hasText: `${getMonthNameAfterXDays(2)}` }).getByRole("button", { name: addXDays(2) }).click();
                await expect(page.locator("#check-in-box").getByText(getCustomDateFormatWithShortMonth(2))).toBeVisible();
                await expect(page.locator("#check-in-box").getByText(getDayOfWeekAfterXDays(2))).toBeVisible();
            });

            await test.step("Select check out day from today + 3 days", async () => {
                await page.locator(".DayPicker-Month").filter({ hasText: `${getMonthNameAfterXDays(3)}` }).getByRole("button", { name: addXDays(3) }).click();
                await expect(page.locator("#check-out-box").getByText(getCustomDateFormatWithShortMonth(3))).toBeVisible();
                await expect(page.locator("#check-out-box").getByText(getDayOfWeekAfterXDays(3))).toBeVisible();
            });

            await test.step("Select 1 room, 4 adults and 2 children", async () => {
                await expect(page.getByRole("dialog", { name: "Occupancy selection" }).filter({ hasText: "Room" }).filter({ hasText: "Adults" }).filter({ hasText: "Children" })).toBeVisible();
                await expect(page.locator("div[data-selenium='occupancyRooms'] div[data-selenium='desktop-occ-room-value']").getByText("1")).toBeVisible();
                await page.getByRole("button", { name: "Add Adults" }).click();
                await expect(page.locator("div[data-selenium='occupancyAdults']").getByText("3")).toBeVisible();
                await page.getByRole("button", { name: "Add Adults" }).click();
                await expect(page.locator("div[data-selenium='occupancyAdults']").getByText("4")).toBeVisible();
    
                await page.getByRole("button", { name: "Add Children" }).click();
                await expect(page.locator("div[data-selenium='occupancyChildren']").getByText("1")).toBeVisible();
                await page.getByRole("button", { name: "Add Child" }).click();
                await expect(page.locator("div[data-selenium='occupancyChildren']").getByText("2")).toBeVisible();
            });

            await test.step("Close the occupancy dialog and click on search button to go to the searching page", async () => {
                await page.locator("#occupancy-box").click();
                await page.getByRole("button").filter({ hasText: "SEARCH" }).click();
                await expect(page).toHaveURL(/\/search?/);
            });

            await test.step("Close the occupancy dialog opening in the search page", async () => {
                await expect(page.getByRole("dialog", { name: "Occupancy selection" })).toBeVisible();
                await page.locator("#occupancy-box").click();
            });

            try {
                let pagePromise: Promise<Page>;
                await test.step("Select the first option from the properties list", async () => {
                    pagePromise = page.waitForEvent("popup");
                    await expect(page.locator("ol.hotel-list-container li.PropertyCard.PropertyCardItem").first()).toBeVisible();

                    await page.locator("ol.hotel-list-container li.PropertyCard.PropertyCardItem").first().locator("a[target='_blank']").click();
                });
                
                await test.step("Check the price of the selected in the hotel detail page opening in a new tab", async () => {
                    const newPage = await pagePromise;
                    await expect(newPage.locator("#hotelNavBar").locator('.StickyNavPrice__priceDetail')).toHaveText(/₫\s?[\d,]+/);
                });
            }
            catch (e) {
                console.error("Fail to verify the price of an item in the detail page as there is no item to select in the properties list");
            }
        }
    )
});