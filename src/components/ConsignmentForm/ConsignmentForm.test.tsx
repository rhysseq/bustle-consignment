import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";
import ConsignmentForm from "./ConsignmentForm";
import "@testing-library/user-event";
import "@testing-library/jest-dom";
import { act } from "react";
import { IConsignmentFormInputs } from "./types";
import { selectMaterialUiSelectOption } from '../../../tests/utils';
import { fetchLocations } from "../../api/fetchLocations";
import { submitConsignment } from "../../api/submitConsignment";


const mockLocations = ["Perth", "Sydney", "Melbourne", "Brisbane", "Adelaide"];

// Mock the api modules
vi.mock("../../api/fetchLocations", () => ({
    fetchLocations: vi.fn(() => Promise.resolve(mockLocations)),
}));
vi.mock("../../api/submitConsignment", () => ({
    submitConsignment: vi.fn((data: IConsignmentFormInputs) => Promise.resolve({
        source: data.source,
        destination: data.destination,
        weight: data.weight,
        dimentions: { width: data.width, height: data.height, depth: data.depth },
        unit: data.unit,
        consignmentId: `CNS-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    })),
}));


beforeEach(() => {
    vi.clearAllMocks();
});


test("Form renders correctly with all fields", async () => {
    await act(async () => {
        render(<ConsignmentForm />);
    });
    expect(screen.getByText("Create Consignment")).toBeTruthy();
    expect(screen.getByTestId("source-select")).toBeTruthy();
    expect(screen.getByTestId("destination-select")).toBeTruthy();
    expect(screen.getByLabelText("Weight (kg)")).toBeTruthy();
    expect(screen.getByLabelText("Width")).toBeTruthy();
    expect(screen.getByLabelText("Height")).toBeTruthy();
    expect(screen.getByLabelText("Depth")).toBeTruthy();
    expect(screen.getByTestId("unit-select")).toBeTruthy();
});


test("Validation errors trigger when inputs are invalid", async () => {
    await act(async () => {
        render(<ConsignmentForm />);
    });

    const weightInput = screen.getByLabelText("Weight (kg)");
    const widthInput = screen.getByLabelText("Width");
    const heightInput = screen.getByLabelText("Height");
    const depthInput = screen.getByLabelText("Depth");

    // Ensure empty values trigger validation 
    await act(async () => {
        fireEvent.change(weightInput, { target: { value: "50" } });
        fireEvent.change(widthInput, { target: { value: "100" } });
        fireEvent.change(heightInput, { target: { value: "200" } });
        fireEvent.change(depthInput, { target: { value: "300" } });

        // Enter empty values to check required validation
        fireEvent.change(weightInput, { target: { value: "" } });
        fireEvent.change(widthInput, { target: { value: "" } });
        fireEvent.change(heightInput, { target: { value: "" } });
        fireEvent.change(depthInput, { target: { value: "" } });
    });
    await screen.findByText(/Weight \(kg\) is required/);
    await screen.findByText(/Width is required/);
    await screen.findByText(/Height is required/);
    await screen.findByText(/Depth is required/);

    // Enter values below minimum threshold
    await act(async () => {
        fireEvent.change(weightInput, { target: { value: "-1" } });
        fireEvent.change(widthInput, { target: { value: "0" } });
        fireEvent.change(heightInput, { target: { value: "-5" } });
        fireEvent.change(depthInput, { target: { value: "-10" } });
    });
    await screen.findByText(/Weight \(kg\) must be at least \d+/);
    await screen.findByText(/Width must be at least \d+/);
    await screen.findByText(/Height must be at least \d+/);
    await screen.findByText(/Depth must be at least \d+/);

    // Enter values above maximum threshold
    await act(async () => {
        fireEvent.change(weightInput, { target: { value: "12001" } });
        fireEvent.change(widthInput, { target: { value: "12001" } });
        fireEvent.change(heightInput, { target: { value: "12001" } });
        fireEvent.change(depthInput, { target: { value: "12001" } });
    });
    await screen.findByText(/Weight \(kg\) cannot exceed \d+/);
    await screen.findByText(/Width cannot exceed \d+/);
    await screen.findByText(/Height cannot exceed \d+/);
    await screen.findByText(/Depth cannot exceed \d+/);

    // Enter valid values to ensure errors disappear
    await act(async () => {
        fireEvent.change(weightInput, { target: { value: "50" } });
        fireEvent.change(widthInput, { target: { value: "100" } });
        fireEvent.change(heightInput, { target: { value: "200" } });
        fireEvent.change(depthInput, { target: { value: "300" } });
    });
    expect(screen.queryByText(/Weight \(kg\) must be at least \d+/)).toBeNull();
    expect(screen.queryByText(/Width must be at least \d+/)).toBeNull();
    expect(screen.queryByText(/Height must be at least \d+/)).toBeNull();
    expect(screen.queryByText(/Depth must be at least \d+/)).toBeNull();
});

test("selects an option from the source dropdown and updates destination to remove warnings", async () => {
    render(<ConsignmentForm />);
    // Ensure fetchLocations was called once
    await waitFor(() => expect(fetchLocations).toHaveBeenCalledTimes(1));

    // Select "Perth" for Source
    await selectMaterialUiSelectOption("Source", "Perth");

    // Ensure the selected value is set in the field
    expect(screen.getByLabelText("Source")).toHaveTextContent("Perth");

    // Select "Perth" for Destination (this should trigger validation)
    await selectMaterialUiSelectOption("Destination", "Perth");

    // Ensure the selected value is set in the field
    expect(screen.getByLabelText("Destination")).toHaveTextContent("Perth");

    // Validate that both fields show the error message
    const errorMessages = screen.getAllByText("Source and destination cannot be the same");
    expect(errorMessages).toHaveLength(2); // One for Source, One for Destination

    // Optionally, check if the errors appear under the correct fields
    expect(errorMessages[0]).toBeInTheDocument();
    expect(errorMessages[1]).toBeInTheDocument();

    // Change Destination to "Melbourne"
    await selectMaterialUiSelectOption("Destination", "Melbourne");

    // Ensure the selected value is updated in the field
    expect(screen.getByLabelText("Destination")).toHaveTextContent("Melbourne");

    // Ensure the error messages disappear
    await waitFor(() => {
        expect(screen.queryByText("Source and destination cannot be the same")).not.toBeInTheDocument();
    });
});


test("check dimension conversion from unit update", async () => {
    render(<ConsignmentForm />);

    // Ensure fetchLocations was called once
    await waitFor(() => expect(screen.getByTestId("unit-select")).toBeInTheDocument());

    // Store previous values for width, height, depth
    const widthInput = screen.getByLabelText("Width");
    const heightInput = screen.getByLabelText("Height");
    const depthInput = screen.getByLabelText("Depth");

    // Set initial values
    fireEvent.change(widthInput, { target: { value: 100 } });
    fireEvent.change(heightInput, { target: { value: 200 } });
    fireEvent.change(depthInput, { target: { value: 300 } });

    // Select centimeters as unit
    await selectMaterialUiSelectOption("Unit", "centimeters");

    // Ensure values have been converted (multiplied by 10)
    await waitFor(() => {
        expect(widthInput).toHaveValue(10);
        expect(heightInput).toHaveValue(20);
        expect(depthInput).toHaveValue(30);
    });

    // Change unit back to millimeters
    await selectMaterialUiSelectOption("Unit", "millimeters");

    // Ensure values have been converted back (divided by 10)
    await waitFor(() => {
        expect(widthInput).toHaveValue(100);
        expect(heightInput).toHaveValue(200);
        expect(depthInput).toHaveValue(300);
    });
});

test("Form submission triggers API call", async () => {
    render(<ConsignmentForm />);
    // Ensure fetchLocations was called once
    await waitFor(() => expect(fetchLocations).toHaveBeenCalledTimes(1));

    // Select "Perth" for Source
    await selectMaterialUiSelectOption("Source", "Perth");

    // Select "Melbourne" for Destination
    await selectMaterialUiSelectOption("Destination", "Melbourne");

    // Enter valid values for Weight, Width, Height, Depth
    fireEvent.change(screen.getByLabelText("Weight (kg)"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Width"), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "200" } });
    fireEvent.change(screen.getByLabelText("Depth"), { target: { value: "300" } });

    // Submit the form
    fireEvent.submit(screen.getByTestId("consignment-form"));

    // Wait for the success alert to appear
    await screen.findByText("Consignment submitted successfully!");

    // Ensure the API was called with the correct data
    expect(submitConsignment).toHaveBeenCalledWith({
        source: "Perth",
        destination: "Melbourne",
        weight: '50',
        width: '100',
        height: '200',
        depth: '300',
        unit: "millimeters",
    });
});