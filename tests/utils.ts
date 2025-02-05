
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { expect } from 'vitest';
import "@testing-library/jest-dom";


/**
 * Utility function to select an option in a Material-UI Select component.
 *
 * @param {string} label - The label of the select element.
 * @param {string} optionText - The text of the option to select.
 * @throws {Error} Throws an error if the specified option is not found.
 * @returns {Promise<void>} A promise that resolves when the option is selected and the dropdown is closed.
 */

export const selectMaterialUiSelectOption = async (label: string, optionText: string) => {
    // Open the select dropdown
    fireEvent.mouseDown(screen.getByLabelText(label));

    // Wait for menu options to appear
    const listbox = await screen.findByRole("listbox");

    // Find the correct option
    const options = await within(listbox).findAllByRole("option");
    const optionToSelect = options.find((option) => option.textContent === optionText);

    if (!optionToSelect) throw new Error(`Option "${optionText}" not found`);

    // Click the option to select it
    fireEvent.click(optionToSelect);

    // Wait for dropdown to close
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
};
