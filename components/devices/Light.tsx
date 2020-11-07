import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import React from "react";

export interface ILightProps {
    inline: bool
}

const Light = (props: ILightProps) => {
    return (
        <Box minWidth={200}>
            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
                <Grid item>
                    <Box p={2}>
                        <Grid container direction={props.inline ? "row" : "column"} spacing={1}>
                            <Grid item>
                                <WbIncandescentOutlinedIcon fontSize="large" />
                            </Grid>
                            <Grid item>
                                    <Typography variant="h4">Name</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item>
                    <Box p={1}>
                        <IconButton aria-label="change device state">
                            <PowerSettingsNewIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Light;