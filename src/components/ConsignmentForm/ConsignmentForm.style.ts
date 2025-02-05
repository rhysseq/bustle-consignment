import { Button, CircularProgress, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ConsignmentFormStyle = {
    Box: styled(Paper)({
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "500px",
    }),
    Form: styled("form")({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }),
    Title: styled("h2")({
        textAlign: "center",
    }),
    Subtitle: styled("h3")({
        textAlign: "center",
    }),
    Loading: styled(CircularProgress)({
    }),
    DimensionBox: styled("div")({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }),
    DimensionContainer: styled("div")({
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
    }),
    Error: styled("p")({
        color: "red",
        textAlign: "center",
    }),
    Success: styled("p")({
        color: "green",
        textAlign: "center",
    }),
    SubmitButton: styled(Button)({
        padding: "1rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }),
};