import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

/**
 * Props for the `SelectField` component.
 *
 * @template TFormInputs - Type representing form inputs.
 */
export interface SelectFieldProps<TFormInputs extends FieldValues> {
    /**
     * The name of the form field. Must be a valid key in `TFormInputs`.
     *
     * @type {Path<TFormInputs>}
     */
    name: Path<TFormInputs>;

    /**
     * The `control` object from React Hook Form, used for managing form state.
     *
     * @type {Control<TFormInputs> | undefined}
     */
    control: Control<TFormInputs> | undefined;

    /**
     * The label displayed for the select field.
     *
     * @type {string}
     */
    label: string;

    /**
     * The list of selectable options.
     *
     * @type {string[]}
     */
    options: string[];

    /**
     * Optional test ID for testing purposes.
     *
     * @type {string | undefined}
     */
    testid?: string;

    /**
     * Validation rules for the field (optional).
     *
     * @type {RegisterOptions<TFormInputs, Path<TFormInputs>> | undefined}
     */
    rules?: RegisterOptions<TFormInputs, Path<TFormInputs>>;
}

/**
 * Props for the `NumericInput` component.
 *
 * @template TFormInputs - Type representing form inputs.
 */
export interface NumericInputProps<TFormInputs extends FieldValues> {
    /**
     * The name of the numeric input field. Must be a valid key in `TFormInputs`.
     *
     * @type {Path<TFormInputs>}
     */
    name: Path<TFormInputs>;

    /**
     * The `control` object from React Hook Form, used for managing form state.
     *
     * @type {Control<TFormInputs> | undefined}
     */
    control: Control<TFormInputs> | undefined;

    /**
     * The label displayed for the numeric input field.
     *
     * @type {string}
     */
    label: string;

    /**
     * The minimum allowed value.
     *
     * @type {number}
     */
    min: number;

    /**
     * The maximum allowed value.
     *
     * @type {number}
     */
    max: number;
}
