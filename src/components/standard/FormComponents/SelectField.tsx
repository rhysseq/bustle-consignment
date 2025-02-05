import { Controller, FieldValues } from "react-hook-form";
import { FormHelperText, MenuItem, TextField } from "@mui/material";
import { SelectFieldProps } from "./types";

/**
 * `SelectField` renders a controlled select input field using Material-UI's `TextField` 
 * and `react-hook-form`'s `Controller`. It integrates validation, error handling, 
 * and supports dynamic options.
 *
 * @template TFormInputs - The type of the form inputs, ensuring strong type safety.
 *
 * @param {SelectFieldProps<TFormInputs>} props - The props for the select field component.
 * @param {keyof TFormInputs} props.name - The name of the form field (should match a key in `TFormInputs`).
 * @param {import("react-hook-form").Control<TFormInputs>} props.control - The `react-hook-form` control object.
 * @param {string} props.label - The label displayed for the select field.
 * @param {string[]} props.options - The list of selectable options.
 * @param {string} [props.testid] - Optional test ID for testing purposes.
 * @param {import("react-hook-form").RegisterOptions<TFormInputs>} [props.rules] - Optional validation rules.
 *
 * @returns {JSX.Element} The controlled Material-UI select field component.
 */

export const SelectField = <TFormInputs extends FieldValues>({
    name,
    control,
    label,
    options,
    testid,
    rules,
}: SelectFieldProps<TFormInputs>): JSX.Element => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
            <>
                <TextField
                    {...field}
                    select
                    label={label}
                    fullWidth
                    slotProps={{
                        htmlInput: { "data-testid": testid },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem data-testid={`${testid}-${option}`} key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
            </>
        )}
    />
);
