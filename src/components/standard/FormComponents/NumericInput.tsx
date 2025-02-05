
import { Controller, FieldValues } from "react-hook-form";
import { TextField } from "@mui/material";
import { NumericInputProps } from "./types";

/**
 * NumericInput component is a controlled input field for numeric values using react-hook-form and Material-UI.
 *
 * @component
 * @param {NumericInputProps} props - The properties for the NumericInput component.
 * @param {string} props.name - The name of the input field.
 * @param {any} props.control - The control object from react-hook-form.
 * @param {string} props.label - The label for the input field.
 * @param {number} props.min - The minimum value allowed for the input field.
 * @param {number} props.max - The maximum value allowed for the input field.
 *
 * @returns {JSX.Element} The rendered NumericInput component.
 */

export const NumericInput = <TFormInputs extends FieldValues>({
    name, control, label, min, max
}: NumericInputProps<TFormInputs>) => (
    <Controller
        name={name}
        control={control}
        rules={{
            required: `${label} is required`,
            min: { value: min, message: `${label} must be at least ${min}` },
            max: { value: max, message: `${label} cannot exceed ${max}` },
        }}
        render={({ field, fieldState }) => (
            <TextField
                {...field}
                label={label}
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ""}
            />
        )}
    />
);
