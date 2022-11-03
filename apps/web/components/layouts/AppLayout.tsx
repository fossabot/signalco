import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQueryClient } from '@tanstack/react-query';
import { Minimize } from '@signalco/ui-icons';
import { Box, Stack } from '@mui/system';
import { IconButton, Sheet } from '@mui/joy';
import NavProfile from '../NavProfile';
import { ChildrenProps } from '../../src/sharedTypes';
import RealtimeService from '../../src/realtime/realtimeService';
import PageNotificationService from '../../src/notifications/PageNotificationService';
import useHashParam from '../../src/hooks/useHashParam';

export function AppLayout(props: ChildrenProps) {
  const {
    children
  } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');
  const queryClient = useQueryClient();

  PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

  // Initiate SignalR communication
  useEffect(() => {
    RealtimeService.startAsync();
    RealtimeService.queryClient = queryClient;
  }, [queryClient]);

  return (
    <>
      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, height: '100vh', width: '100%' }}>
        {isFullScreen !== 'on' && (
          <NavProfile />
        )}
        <Box sx={{ height: '100vh', overflow: 'auto', width: '100%', flexGrow: 1, position: 'relative' }}>
          {children}
        </Box>
      </Stack>
      <ReactQueryDevtools initialIsOpen={false} />
      {isFullScreen && (
        <IconButton
          size="lg"
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
          sx={{ position: 'fixed', bottom: '12px', right: '12px' }}
          onClick={() => setFullScreenHash(undefined)}>
          <Minimize />
        </IconButton>
      )}
    </>
  );
}
