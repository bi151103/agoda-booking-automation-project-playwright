import { test, expect } from '@fixtures';
import { type Page } from '@playwright/test';
import { getDayAfterXDays, getCustomDateFormatWithShortMonthAfterXDays, getDayOfWeekAfterXDays, getMonthNameAfterXDays } from "@shared/utils";

test.describe("Hotel booking detail page", () => {
    test.beforeEach(async ({ homePage }) => {
        await test.step("Access the agoda.com site with the language is english and the currency is VND", async () => {

            await homePage.navigateTo('/en-gb/?cur=VND');
            await homePage.closeThe10PercentsBookingDialog();

            await expect(homePage.save10PercentsBookingDialogTitleEle()).toBeHidden();
        });
    });
    
    test("should show hotel detail with a correct price displayed after clicking on the first result from the properties list",
        async ({ homePage, page, searchPage }) => {
            await test.step("Choose the option 'Hotel' and 'Overnight Stays' in the filter", async () => {
                await homePage.selectHotelTabInTheFilter();
                await expect(homePage.holelTabInSelectedStateEle()).toBeVisible();

                await homePage.selectOvernightAndStaysOptionsInHotelTab();
                await expect(homePage.overnightAndStaysButtonInSelectedStateEle()).toBeVisible();
            });

            const searchText = "Muong Thanh Saigon Centre Hotel";
            await test.step("Enter 'Muong Thanh Saigon Centre Hotel' into the Destination or property input", async () => {
                const hotelSearchResponsePromise = page.waitForResponse((response) =>
                    response.url().includes("api/cronos/search/GetUnifiedSuggestResult") &&
                    new URL(response.url()).searchParams.get('searchText') === searchText &&
                    response.status() === 200
                );
                await homePage.fillInDestionationAndPropertyInputInHolelTab(searchText);
                await hotelSearchResponsePromise;
                await homePage.closeTheDestionationSearchDialog();
                await expect(homePage.destinationAndPropertyInputEle()).toHaveValue(searchText);
            });

            await test.step("Select check in day from today + 2 days", async () => {
                await homePage.selectCheckInDate(getMonthNameAfterXDays(2), getDayAfterXDays(2));
                await expect(homePage.checkInDateInputEle().getByText(getCustomDateFormatWithShortMonthAfterXDays(2))).toBeVisible();
                await expect(homePage.checkInDateInputEle().getByText(getDayOfWeekAfterXDays(2))).toBeVisible();
            });

            await test.step("Select check out day from today + 3 days", async () => {
                await homePage.selectCheckOutDate(getMonthNameAfterXDays(3), getDayAfterXDays(3));
                await expect(homePage.checkOutDateInputEle().getByText(getCustomDateFormatWithShortMonthAfterXDays(3))).toBeVisible();
                await expect(homePage.checkOutDateInputEle().getByText(getDayOfWeekAfterXDays(3))).toBeVisible();
                await expect(homePage.occupancyDialogEle()).toBeVisible();
            });

            await test.step("Select 1 room, 4 adults and 2 children", async () => {
                await homePage.selectNumberOfRoomsInOccupancyDialog(1);
                await expect(homePage.numberOfRoomsInOccupancyDialogEle()).toHaveText("1");
                
                await homePage.selectNumberOfAdultsInOccupationDialog(4);
                await expect(homePage.numberOfAdultsInOccupancyDialogEle()).toHaveText("4");
                
                await homePage.selectNumberOfChildrenInOccupationDialog(2);
                await expect(homePage.numberOfChildrenInOccupancyDialogEle()).toHaveText("2");
            });

            await test.step("Close the occupancy dialog and click on search button to go to the searching page", async () => {
                await homePage.closeOccupancyDialog();
                await homePage.submitTheFilter();
                await expect(page).toHaveURL(/\/search?/);
            });

            await test.step("Close the occupancy dialog opening in the search page", async () => {
                await expect(searchPage.occupancyDialogEle()).toBeVisible();
                await searchPage.closeOccupancyDialog();
            });

            let pagePromise: Promise<Page>;
            await test.step("Select the first option from the properties list", async () => {
                pagePromise = page.waitForEvent("popup");

                await searchPage.selectPropertyFromThePropertiesList(0);
            });
            
            await test.step("Check the price of the selected in the hotel detail page opening in a new tab", async () => {
                const newPage = await pagePromise;
                await expect(newPage.locator("#hotelNavBar").locator('.StickyNavPrice__priceDetail')).toHaveText(/₫\s?[\d,]+/);
            });
        }
    )
});