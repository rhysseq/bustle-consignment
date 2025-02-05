/**
 * The API response for fetching locations.
 */
export interface ILocationsResponse {
    locations: string[];
}

/**
 * Helper function to parse API response safely.
 *
 * @param {Response} response - The fetch API response.
 * @returns {Promise<ILocationsResponse>} - The parsed JSON response.
 * @throws {Error} - If the response format is invalid.
 */
const parseLocationsResponse = async (response: Response): Promise<ILocationsResponse> => {
    const data = await response.json();

    if (!data.locations || !Array.isArray(data.locations)) {
        throw new Error("Invalid response format");
    }

    return data;
};

/**
 * Fetches the list of available locations from the API.
 *
 * @returns {Promise<string[]>} - The list of locations.
 * @throws {Error} - If fetching fails.
 */
export const fetchLocations = async (): Promise<string[]> => {
    try {
        const response = await fetch("/api/locations");
        if (!response.ok) {
            throw new Error("Failed to fetch locations");
        }

        const { locations } = await parseLocationsResponse(response);

        return locations;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw new Error("Unable to load locations. Please try again later.");
    }
};
