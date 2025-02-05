import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IConsignmentDimensionsProps, IConsignmentFormInputs, INITIAL_CONSIGNMENT_FORM, Units } from "./types";
import { ConsignmentFormStyle as S } from "./ConsignmentForm.style"
import { submitConsignment } from "../../api/submitConsignment";
import { fetchLocations } from "../../api/fetchLocations";
import { NumericInput } from "../standard/FormComponents/NumericInput";
import { SelectField } from "../standard/FormComponents/SelectField";

/**
 * Component for handling consignment dimensions input.
 * 
 * @component
 * @param {IConsignmentDimensionsProps} props - Props for the component.
 * @returns {JSX.Element} The rendered component.
 */

const ConsignmentDimensions: React.FC<IConsignmentDimensionsProps> = ({ control, watch, setValue, getValues }) => {
    // read the unit and calulate the min and max values for the dimensions
    const unit = watch("unit");
    const min = unit === Units.CENTIMETERS ? 1 : 1;
    const max = unit === Units.CENTIMETERS ? 1200 : 12000;

    // automatically update width, height and depth based on the unit
    useEffect(() => {
        if (unit === Units.CENTIMETERS) {
            const width = getValues('width')
            const height = getValues('height')
            const depth = getValues('depth')
            setValue("width", width / 10);
            setValue("height", height / 10);
            setValue("depth", depth / 10);
        } else {
            const width = getValues('width')
            const height = getValues('height')
            const depth = getValues('depth')
            setValue("width", width * 10);
            setValue("height", height * 10);
            setValue("depth", depth * 10);
        }
    }, [unit, control, setValue, getValues]);

    return (
        <S.DimensionBox>
            <S.Subtitle>Dimensions</S.Subtitle>
            <S.DimensionContainer>
                <NumericInput
                    name="width"
                    control={control}
                    label="Width"
                    min={min}
                    max={max}
                />
                <NumericInput
                    name="height"
                    control={control}
                    label="Height"
                    min={min}
                    max={max}
                />
                <NumericInput
                    name="depth"
                    control={control}
                    label="Depth"
                    min={min}
                    max={max}
                />
            </S.DimensionContainer>
            <SelectField
                name="unit"
                control={control}
                label="Unit"
                options={Object.values(Units)}
                testid="unit-select"
                rules={{
                    required: "Unit is required",
                }}
            />
        </S.DimensionBox>
    );
}

/**
 * Main form component for creating a consignment.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 */

const ConsignmentForm: React.FC = () => {
    const {
        control,
        handleSubmit,
        watch,
        trigger,
        setValue,
        getValues,
        formState: { isValid },
    } = useForm<IConsignmentFormInputs>({
        mode: "onChange",
        defaultValues: INITIAL_CONSIGNMENT_FORM
    });

    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const source = watch("source");
    const destination = watch("destination");

    useEffect(() => {
        setLoading(true);
        fetchLocations()
            .then(setLocations)
            .catch(() => setError("Failed to load locations"))
            .finally(() => setLoading(false));
    }, []);

    // when source or destination change, trigger revalidation to clear any errors
    useEffect(() => {
        if (destination) {
            trigger("destination");
        }
        if (source) {
            trigger("source");
        }
    }, [source, trigger, destination]);

    const onSubmit = async (data: IConsignmentFormInputs) => {
        setLoading(true);
        try {
            await submitConsignment(data);
            setError(null);
            setMessage("Consignment submitted successfully!");
        } catch (err) {
            setError(`Failed to submit consignment: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Box>
            <S.Title>Create Consignment</S.Title>
            {loading && <S.Loading />}
            {error && <S.Error>{error}</S.Error>}
            {message && <S.Success>{message}</S.Success>}
            <S.Form onSubmit={handleSubmit(onSubmit)}>
                <SelectField
                    name="source"
                    control={control}
                    label="Source"
                    options={locations}
                    testid="source-select"
                    rules={{
                        required: "Source is required",
                        validate: (value) => value !== destination || "Source and destination cannot be the same",
                    }}
                />
                <SelectField
                    name="destination"
                    control={control}
                    label="Destination"
                    options={locations}
                    testid="destination-select"
                    rules={{
                        required: "Destination is required",
                        validate: (value) => value !== source || "Source and destination cannot be the same",
                    }}
                />
                <NumericInput
                    name="weight"
                    control={control}
                    label="Weight (kg)"
                    min={1}
                    max={1000}
                />
                <ConsignmentDimensions
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    getValues={getValues}
                />
                <S.SubmitButton
                    data-testid="consignment-form"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isValid}>
                    Submit
                </S.SubmitButton>
            </S.Form>
        </S.Box>
    );
};

export default ConsignmentForm;
