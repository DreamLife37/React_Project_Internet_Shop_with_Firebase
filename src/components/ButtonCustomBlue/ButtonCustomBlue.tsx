import Button from "@mui/material/Button";
import React, {FC} from "react";

type ButtonCustomBlueType = {
    handleButton: () => void
    title: string
    styleFontSize?: string

}
export const ButtonCustomBlue: FC<ButtonCustomBlueType> = ({handleButton, title, styleFontSize}) => {
    return <Button
        style={{marginTop: '10px', fontSize: `${styleFontSize ? styleFontSize : '0.7rem'}`}} variant="contained"
            sx={{backgroundColor: '#4E97FD'}}
            onClick={handleButton}>{title}
            </Button>
        }
