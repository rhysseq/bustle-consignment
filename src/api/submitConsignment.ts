import { IConsignmentFormInputs } from "../components/ConsignmentForm/types";

/**
 * Interface representing the API request payload for submitting a consignment.
 */
export interface IConsignmentRequest {
    source: string;
    destination: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    units: string;
}

/**
 * Interface representing the API response for a successful consignment submission.
 */
export interface IConsignmentResponse {
    consignmentId: string;
    source: string;
    destination: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    units: string;
}

/**
 * Helper function to package form data into the API request payload format.
 *
 * @param {IConsignmentFormInputs} data - The form input data.
 * @returns {IConsignmentRequest} - The structured request payload.
 */
const createConsignmentPayload = (data: IConsignmentFormInputs): IConsignmentRequest => ({
    source: data.source,
    destination: data.destination,
    weight: data.weight,
    dimensions: {
        width: data.width,
        height: data.height,
        depth: data.depth,
    },
    units: data.unit,
});

/**
 * Submits consignment data to the API.
 *
 * @param {IConsignmentFormInputs} data - The form input data.
 * @returns {Promise<IConsignmentResponse>} - The API response with a generated consignment ID.
 * @throws {Error} - If the submission fails.
 */
export const submitConsignment = async (data: IConsignmentFormInputs): Promise<IConsignmentResponse> => {
    const payload = createConsignmentPayload(data);
    return new Promise<IConsignmentResponse>((resolve, reject) => {
        setTimeout(() => {
            const shouldFail = Math.random() < 0.2;
            if (shouldFail) {
                reject(new Error("Mock API request failed"));
            } else {
                resolve({
                    consignmentId: `CNS-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    source: payload.source,
                    destination: payload.destination,
                    weight: payload.weight,
                    dimensions: payload.dimensions,
                    units: payload.units,
                });
            }
        }, 1000);
    });
    // try {
    //     const response = await fetch("/api/submit-consignment", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(payload),
    //     });

    //     if (!response.ok) {
    //         throw new Error("Failed to submit consignment");
    //     }

    //     const responseData: IConsignmentResponse = await response.json();

    //     return {
    //         ...responseData,
    //         consignmentId: `CNS-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    //     };
    // } catch (error) {
    //     console.error("Error submitting consignment:", error);
    //     throw new Error("Submission failed. Please try again.");
    // }
};
