import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

/**
 * Enum representing measurement units.
 *
 * @readonly
 * @enum {string}
 */
export enum Units {
    /**
     * Represents centimeters.
     */
    CENTIMETERS = "centimeters",
    /**
     * Represents millimeters.
     */
    MILLIMETERS = "millimeters"
}

/**
 * The initial default values for the consignment form.
 *
 * @type {IConsignmentFormInputs}
 */
export const INITIAL_CONSIGNMENT_FORM: IConsignmentFormInputs = {
    source: "",
    destination: "",
    weight: 0,
    width: 1,
    height: 1,
    depth: 1,
    unit: Units.MILLIMETERS
}

/**
 * Interface representing the input fields for a consignment form.
 *
 * @interface
 */
export interface IConsignmentFormInputs {
    /**
     * The source location for the consignment.
     *
     * @type {string}
     */
    source: string;
    /**
     * The destination location for the consignment.
     *
     * @type {string}
     */
    destination: string;
    /**
     * The weight of the consignment.
     *
     * @type {number}
     */
    weight: number;
    /**
     * The width of the consignment.
     *
     * @type {number}
     */
    width: number;
    /**
     * The height of the consignment.
     *
     * @type {number}
     */
    height: number;
    /**
     * The depth of the consignment.
     *
     * @type {number}
     */
    depth: number;
    /**
     * The unit of measurement for the consignment dimensions.
     *
     * @type {Units}
     */
    unit: Units;
}

/**
 * Interface representing the properties required for managing consignment dimensions.
 *
 * @interface
 */
export interface IConsignmentDimensionsProps {
    /**
     * React Hook Form control object for managing form state.
     *
     * @type {Control<IConsignmentFormInputs>}
     */
    control: Control<IConsignmentFormInputs>;
    /**
     * Function to subscribe to changes in form values.
     *
     * @type {UseFormWatch<IConsignmentFormInputs>}
     */
    watch: UseFormWatch<IConsignmentFormInputs>;
    /**
     * Function to update form values.
     *
     * @type {UseFormSetValue<IConsignmentFormInputs>}
     */
    setValue: UseFormSetValue<IConsignmentFormInputs>;
    /**
     * Function to retrieve current form values.
     *
     * @type {UseFormGetValues<IConsignmentFormInputs>}
     */
    getValues: UseFormGetValues<IConsignmentFormInputs>;
}
