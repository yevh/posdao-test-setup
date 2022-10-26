const Web3 = require('web3');
const web3 = new Web3('http://localhost:8641');
const constants = require('../utils/constants');
const SnS = require('../utils/signAndSendTx.js');
const expect = require('chai').expect;

const BlockRewardAuRa = require('../utils/getContract')('BlockRewardAuRa', web3);

const OWNER = constants.OWNER;
const OWNER_SF = constants.OWNER_SF;

describe('Zero gas price transactions test', () => {
  it('Service transactions do not work after the merge', async function() {
    let block = await web3.eth.getBlock('latest');

    // Make sure the merge is in the past
    expect(!block.step && !!block.mixHash, 'It seems the merge has not happened yet').to.equal(true);

    // Try to send zero gas price transaction from the certified account
    console.log('    Trying to send zero gas price transaction ...');
    web3.eth.transactionPollingTimeout = 20;
    try {
      await SnS(web3, {
        from: OWNER,
        to: BlockRewardAuRa.address,
        method: BlockRewardAuRa.instance.methods.setErcToNativeBridgesAllowed([OWNER]),
        gasPrice: '0',
        gasLimit: '10000000'
      });
      expect(false, "service tx cannot succed after the merge").to.equal(true)
    } catch (e) {
      const rightError = e.message.includes(`Transaction was not mined within ${web3.eth.transactionPollingTimeout} seconds`) || e.message.includes('FeeTooLow');
      expect(rightError, e.message).to.equal(true);
    }

    // Try to send zero gas price transaction from the certified account
    console.log('    Trying to send zero gas price transaction ...');
    web3.eth.transactionPollingTimeout = 20;
    try {
      await SnS(web3, {
        from: OWNER_SF,
        to: BlockRewardAuRa.address,
        method: BlockRewardAuRa.instance.methods.setErcToNativeBridgesAllowed([OWNER_SF]),
        gasPrice: '0',
        gasLimit: '10000000'
      });
      expect(false, "service tx cannot be executed after the merge").to.equal(true)
    } catch (e) {
      const rightError = e.message.includes(`Transaction was not mined within ${web3.eth.transactionPollingTimeout} seconds`) || e.message.includes('FeeTooLow');
      expect(rightError, e.message).to.equal(true);
    }
  });
});
