import fs from 'fs/promises';
import { google, sheets_v4, Auth } from 'googleapis'

class GoogleSheets {

    CREDENTIALS_PATH: string

    SCOPES: string[]

    sheets: sheets_v4.Sheets | undefined;

    constructor({ CREDENTIALS_PATH, SCOPES }: { CREDENTIALS_PATH: string, SCOPES: string[] }) {
        if (!CREDENTIALS_PATH || !SCOPES || SCOPES.length === 0) {
            throw new Error('Missing TOKEN_PATH or CREDENTIALS_PATH');
        }
        console.log(
            `CREDENTIALS_PATH: ${CREDENTIALS_PATH}\nSCOPES: ${SCOPES}`
        )
        this.CREDENTIALS_PATH = CREDENTIALS_PATH;
        this.SCOPES = SCOPES;
    }

    async getSheetInstance() {
        if (this.sheets) return this.sheets;

        const content = await fs.readFile(this.CREDENTIALS_PATH, { encoding: 'utf-8' });
        const keys = JSON.parse(content);
        const client = new Auth.JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: this.SCOPES,
        })
        const sheets = google.sheets({ version: 'v4', auth: client });
        return sheets
    }

    /**
     * Creates a new Google Spreadsheet with the given title.
     *
     * @param {string} title - The title of the new spreadsheet.
     * @return {Promise<string>} A promise that resolves with the ID of the newly created spreadsheet.
     * @throws {Error} If there is an error creating the spreadsheet.
     */
    async createSpreadsheet(title: string) {
        const sheets = await this.getSheetInstance();
        const resource = {
            properties: {
                title,
            },
        };
        try {
            const spreadsheet = await sheets.spreadsheets.create({
                // @ts-ignore
                resource,
                fields: 'spreadsheetId',
            });
            // @ts-ignore
            return spreadsheet.data.spreadsheetId;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Updates the values in a specified range of a Google Spreadsheet.
     *
     * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
     * @param {string} range - The range of cells to update values in.
     * @param {Array<Array<any>>} values - The new values to update in the range.
     * @param {'USER_ENTERED'|'RAW'} [valueInputOption='USER_ENTERED'] - The input option for the values.
     * @return {Promise<any>} - A promise that resolves when the values are successfully updated.
     * @throws {Error} - If there is an error updating the values.
     */
    async updateValues(spreadsheetId: string, range: string, values: Array<Array<any>>, valueInputOption = 'USER_ENTERED') {
        const sheets = await this.getSheetInstance();
        try {
            const response = await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption,
                includeValuesInResponse: false,
                requestBody: {
                    range: range,
                    values: values
                },
            });
            return response.data;
        } catch (err) {
            console.log(`The API returned an error: ${err}`);
        }
    }

    /**
     * Retrieves the values from a specified range in a Google Spreadsheet.
     *
     * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
     * @param {string} range - The range of cells to retrieve values from.
     * @return {Promise<Array<Array<any>>>} - A promise that resolves to an array of arrays containing the values from the specified range.
     *                                      If no data is found, an empty array is returned.
     */
    async getValues(spreadsheetId: string, range: string) {
        const sheets = await this.getSheetInstance();
        try {
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const rows = res.data.values;
            if (!rows || rows.length === 0) {
                console.log('No data found.');
                return [];
            }
            return rows;
        } catch (err) {
            console.log(`The API returned an error: ${err}`);
        }
    }
    /**
     * Appends values to a specified range in a Google Spreadsheet.
     *
     * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
     * @param {string} range - The range of cells to append values to.
     * @param {Array<Array<any>>} values - The values to append to the range.
     * @param {'USER_ENTERED'|'RAW'} [valueInputOption='USER_ENTERED'] - The input option for the values.
     * @return {Promise<any>} - A promise that resolves when the values are successfully appended.
     * @throws {Error} - If there is an error appending the values.
     */
    async appendValues(spreadsheetId: string, range: string, values: Array<Array<any>>, valueInputOption: 'USER_ENTERED' | 'RAW' = 'USER_ENTERED'): Promise<any> {
        const sheets = await this.getSheetInstance();

        try {
            const response = await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption,
                includeValuesInResponse: false,
                requestBody: {
                    range: range,
                    values: values
                },
            });
            return response.data;
        } catch (err) {
            console.log(`The API returned an error: ${err}`);
        }
    }
}

export default GoogleSheets;
