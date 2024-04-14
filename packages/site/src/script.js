const snapId = 'npm:@consensys/lxp-snap';

/*
 * Use EIP-6963 to detect MetaMask
 */

const MetaMaskFound = async (providerDetail) => {
  document.getElementById('loading').className = 'found';

  const btn = document.createElement('button');
  btn.className = 'btn btn-primary btn-lg';
  btn.textContent = 'Install Snap';

  const caption = document.createElement('p');
  caption.className = 'caption';
  caption.textContent = 'Step 1';

  const { provider } = providerDetail;

  btn.onclick = async (event) => {
    event.preventDefault();
    try {
      const result = await provider.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {},
        },
      });

      if (result) {
        try {
          const snaps = await provider.request({
            method: 'wallet_getSnaps',
          });
          if (Object.keys(snaps).includes(snapId)) {
            // snap installed, go to step 2
            await snapInstalled(provider);
          } else {
            // the snap was not installed
          }
        } catch (error) {}
      }
    } catch (error) {}
  };
  document.getElementById('loading').textContent = '';
  document.getElementById('loading').appendChild(caption);
  document.getElementById('loading').appendChild(btn);
};

const snapInstalled = async (provider) => {
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary btn-lg';
  btn.textContent = 'Connect Account';

  const caption = document.createElement('p');
  caption.className = 'caption';
  caption.textContent = 'Step 2';

  const alternate = document.createElement('p');
  alternate.className = 'alt';
  alternate.textContent = 'Or ';
  const alternateLink = document.createElement('a');
  alternateLink.textContent = 'watch an address';
  alternate.appendChild(alternateLink);

  alternateLink.onclick = async (event) => {
    event.preventDefault();
    const response = await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'watchLxpAddress',
        },
      },
    });
    const message = document.createElement('p');
    if (response !== null) {
      // get the watched address
      message.textContent = 'Watched address: ';
      const address = document.createElement('code');
      address.textContent = `${response}`;
      message.appendChild(address);
    } else {
      message.textContent = 'Failed to watch address';
    }
    document.getElementById('context').textContent = '';
    document.getElementById('context').appendChild(message);
  };

  btn.onclick = async (event) => {
    event.preventDefault();
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
      params: [],
    });
    if (accounts.length > 0) {
      const response = await provider.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'setLxpAddress',
            params: {
              lxpAddress: accounts[0],
            },
          },
        },
      });
      const message = document.createElement('p');
      if (response === accounts[0]) {
        // get the first entry
        message.textContent = 'Connected address: ';
        const address = document.createElement('code');
        address.textContent = `${accounts[0]}`;
        message.appendChild(address);
      } else {
        message.textContent = 'Failed to connect address';
      }
      document.getElementById('context').textContent = '';
      document.getElementById('context').appendChild(message);
    }
  };
  document.getElementById('loading').textContent = '';
  document.getElementById('loading').appendChild(caption);
  document.getElementById('loading').appendChild(btn);
  document.getElementById('loading').appendChild(alternate);
};

window.onload = function () {
  window.addEventListener('eip6963:announceProvider', (event) => {
    /* event.detail contains the discovered provider interface */
    const providerDetail = event.detail;

    /*
     * You could take one of these cases and use it for your needs,
     * or set up a conditional that takes any of these possibilities,
     * or prompt the user to choose which MetaMask flavor they want to use
     * in case they have multiple MetaMask extensions installed at the same time
     */
    if (providerDetail.info.rdns == 'io.metamask') {
      /* this is MetaMask */
      MetaMaskFound(providerDetail);
    } else if (providerDetail.info.rdns == 'io.metamask.flask') {
      /* this is MetaMask Flask */
      MetaMaskFound(providerDetail);
    } else if (providerDetail.info.rdns == 'io.metamask.mmi') {
      /* this is MetaMask Institutional */
      MetaMaskFound(providerDetail);
    }
  });

  window.dispatchEvent(new Event('eip6963:requestProvider'));

  setTimeout(() => {
    if (document.getElementById('loading').className !== 'found') {
      /* Assume MetaMask was not detected */
      document.getElementById('loading').textContent = '';
      document
        .getElementById('loading')
        .insertAdjacentHTML(
          'afterbegin',
          "Please install <a href='https://metamask.io/'>MetaMask</a> first.",
        );
    }
  }, 1000);
};
