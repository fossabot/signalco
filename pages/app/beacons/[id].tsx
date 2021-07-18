import { Alert, Box, Card, CardContent, CardHeader, Grid, LinearProgress, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import BeaconsRepository, { IBeaconModel } from '../../../src/beacons/BeaconsRepository';

const BeaconDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [beacon, setBeacon] = useState<IBeaconModel | undefined>();

    useEffect(() => {
        const loadBeaconAsync = async () => {
            try {
                if (typeof id !== "object" &&
                    typeof id !== 'undefined') {
                    const loadedBeacon = await BeaconsRepository.getBeaconAsync(id);
                    setBeacon(loadedBeacon);
                }
            } catch (err) {
                setError(err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        loadBeaconAsync();
    }, [id]);

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Grid container spacing={2} direction="column" wrap="nowrap">
                <Grid item>
                    <Typography variant="h1">{beacon?.id}</Typography>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Card>
                                <CardHeader title="Information" />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item><span>Registered date</span></Grid>
                                        <Grid item>
                                            {isLoading && <LinearProgress />}
                                            {error && <Alert color="error">Failed to load Beacon information: {error}</Alert>}
                                            {beacon?.registeredTimeStamp &&
                                                <ReactTimeago date={beacon?.registeredTimeStamp} />
                                            }
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

BeaconDetails.layout = AppLayout;

export default observer(BeaconDetails);