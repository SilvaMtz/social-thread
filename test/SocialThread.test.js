const SocialThread = artifacts.require('./SocialThread.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('SocialThread', (accounts) => {
  let socialThread;

  before(async() => {
    socialThread = await SocialThread.deployed();
  });

  describe('deployment', async() => {
    it('deploys successfully', async() => {
      const address = await socialThread.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })

    it('has a name', async() => {
      const name = await socialThread.name();
      assert.equal(name, 'The Social Thread');
    })
  })

});