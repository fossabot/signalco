import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { SnackbarProvider } from 'notistack';
import { ChildrenProps } from '../src/sharedTypes';
import IAppContext from '../src/appContext/IAppContext';
import useAppTheme from '../src/hooks/useAppTheme';

interface PageWithMetadata extends React.FunctionComponent {
  layout?: React.FunctionComponent | undefined
};

interface PageWithTitle extends React.FunctionComponent {
  title?: string | undefined;
};

const appContextDefaultState: IAppContext = {
  theme: 'light',
  isDark: false
};

export const AppContext = React.createContext<IAppContext>(appContextDefaultState);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [appContextState, setAppContextState] = React.useState<IAppContext>(appContextDefaultState);
  useAppTheme(appContextState, setAppContextState);

  const Layout = (Component as PageWithMetadata).layout ?? ((props?: ChildrenProps) => <>{props?.children}</>);
  const title = (Component as PageWithTitle).title;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
        <meta name="theme-color" content={`${appContextState.isDark ? '#000000' : '#ffffff'}`}></meta>
        <meta name="description" content="Automate your life" />
        <title>{`Signalco${title ? ' - ' + title : ''}`}</title>
      </Head>
      <ThemeProvider theme={appTheme(appContextState.theme)}>
        <AppContext.Provider value={appContextState}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </AppContext.Provider>
      </ThemeProvider>
    </>
  );
}
