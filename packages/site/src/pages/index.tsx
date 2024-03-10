import { useContext, useState } from 'react';
import styled from 'styled-components';

import {
  Card,
  ConnectButton,
  GetLxpAddressButton,
  InstallFlaskButton,
  PersonalSign,
  ReconnectButton,
  SetLxpAddressButton,
} from '../components';
import { LxpAddressInput } from '../components/Other/Input';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }

  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const { state, dispatch, provider } = useContext(MetaMaskContext);
  const [lxpAddressValue, lxpAddressSetValue] = useState('');

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      // This function will only be triggerable if a provider is available
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await connectSnap(provider!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const installedSnap = await getSnap(provider!);

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleGetLxpAddress = async () => {
    try {
      const result = await window.ethereum.request<boolean>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'getLxpAddress',
          },
        },
      });
      console.log('The LXP Address is', result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetLxpAddress = async () => {
    try {
      await window.ethereum.request<boolean>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'setLxpAddress',
            params: {
              lxpAddress: lxpAddressValue,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePersonalSign = async () => {
    //  TODO
  };

  return (
    <Container>
      <Heading>
        <Span>LXP Snap</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <>
            <Card
              content={{
                title: 'Reconnect',
                description:
                  'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
                button: (
                  <ReconnectButton
                    onClick={handleConnectClick}
                    disabled={!state.installedSnap}
                  />
                ),
              }}
              disabled={!state.installedSnap}
            />
            <Card
              content={{
                title: 'Get LXP Address',
                description: 'Check the wallet address linked to your LXP',
                button: (
                  <GetLxpAddressButton
                    onClick={handleGetLxpAddress}
                    disabled={!state.installedSnap}
                  />
                ),
              }}
              disabled={!state.installedSnap}
            />
            <Card
              content={{
                title: 'Set LXP Address',
                description:
                  'Please enter the wallet address linked to your LXP',
                input: <LxpAddressInput onChangeHandler={lxpAddressSetValue} />,
                button: (
                  <SetLxpAddressButton
                    onClick={handleSetLxpAddress}
                    disabled={!state.installedSnap}
                  />
                ),
              }}
              disabled={!state.installedSnap}
            />
            <Card
              content={{
                title: 'Personal Sign',
                description:
                  'Please enter the wallet address linked to your LXP',
                button: (
                  <PersonalSign
                    onClick={handlePersonalSign}
                    disabled={!state.installedSnap}
                  />
                ),
              }}
              disabled={!state.installedSnap}
            />
          </>
        )}
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
