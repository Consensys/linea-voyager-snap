import { useContext, useEffect, useState } from 'react';
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
  stringToHex,
  truncateAddress,
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
  const [lxpAddressValue, setLxpAddressValue] = useState<string>();
  const [claimMessage, setClaimMessage] = useState<string>();
  const [snapLxpAddress, setSnapLxpAddress] = useState<string>();
  const [connectedAccount, setConnectedAccount] = useState<string>();

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
      const result = await window.ethereum.request<string>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'getLxpAddress',
          },
        },
      });

      if (result) {
        setSnapLxpAddress(result);
      }
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
    setClaimMessage('Pending...');
    try {
      const payload = {
        address: connectedAccount,
        signedOn: Date.now(),
        subject: 'LXP Snap Activation',
      };
      const message = `0x${stringToHex(JSON.stringify(payload))}`;

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, connectedAccount],
      });

      const res = await window.ethereum.request<{
        status: string;
        message?: string;
      }>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'personalSign',
            params: {
              signature,
              payload,
            },
          },
        },
      });

      if (res?.status === 'ok') {
        setClaimMessage('Claimed successfully 🎉');
      } else {
        setClaimMessage(`Something went wrong 😔 ${res?.message ?? ''}`);
      }
    } catch (error) {
      setClaimMessage(undefined);
      console.error(error);
    }
  };

  useEffect(() => {
    const connectAccount = async () => {
      if (state.installedSnap) {
        const accounts = await window.ethereum
          .request<string[]>({ method: 'eth_requestAccounts' })
          .catch((error) => {
            console.error(error);
          });

        if (!accounts) {
          return;
        }

        setConnectedAccount(accounts[0]);

        await handleGetLxpAddress();
      }
    };

    connectAccount().then().catch(console.error);
  }, [state.installedSnap]);

  const isClaimDisabled = (
    installedSnap: boolean,
    lxpAddressInSnap?: string,
    connectedAccountInDapp?: string,
  ) => {
    return (
      !installedSnap ||
      !lxpAddressInSnap ||
      !connectedAccountInDapp ||
      lxpAddressInSnap.toLowerCase() !== connectedAccountInDapp.toLowerCase()
    );
  };

  const getClaimDescription = (message?: string) => {
    if (message) {
      return message;
    } else if (!state.installedSnap) {
      return 'You need to install the LXP Snap first';
    } else if (!connectedAccount) {
      return 'You need to connect your wallet first';
    } else if (!snapLxpAddress) {
      return 'You need to set your LXP address first';
    } else if (
      snapLxpAddress.toLowerCase() !== connectedAccount.toLowerCase()
    ) {
      return 'You need to connect with the same wallet as the one set in the LXP Snap';
    }

    return 'Claim your LXP by signing a message with your wallet';
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
        )}
        <Card
          content={{
            title: 'Get LXP Address',
            description: `${
              snapLxpAddress
                ? truncateAddress(snapLxpAddress)
                : 'Check the wallet address linked to your LXP'
            }`,
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
            description: 'Please enter the wallet address holding your LXP',
            input: <LxpAddressInput onChangeHandler={setLxpAddressValue} />,
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
            title: 'Claim your LXP',
            description: getClaimDescription(claimMessage),
            button: (
              <PersonalSign
                onClick={handlePersonalSign}
                disabled={isClaimDisabled(
                  Boolean(state.installedSnap),
                  snapLxpAddress,
                  connectedAccount,
                )}
              />
            ),
          }}
          disabled={isClaimDisabled(
            Boolean(state.installedSnap),
            snapLxpAddress,
            connectedAccount,
          )}
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
