const Client = require('bitcoin-core');

const client = new Client({
  network: 'mainnet',
  username: 'YOUR_USERNAME',
  password: 'YOURPASSWORD',
});

const numWallets = 100;

{/*}
for (let i = 0; i < numWallets; i++) {
  const walletName = `wallet${i};
  client.createWallet(walletName).then(() => {
    console.log(Wallet ${walletName} created.);
  }).catch((err) => {
    console.log(Error creating wallet ${walletName}: ${err}`);
  });
}
*/}