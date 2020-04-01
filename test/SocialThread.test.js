const SocialThread = artifacts.require('./SocialThread.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('SocialThread', ([deployer, author, tipper]) => {
  let socialThread;

  before(async() => {
    socialThread = await SocialThread.deployed();
  });

  describe('deployment', async() => {
    it('Deploys successfully', async() => {
      const address = await socialThread.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('Has a name', async() => {
      const name = await socialThread.name();
      assert.equal(name, 'The Social Thread');
    });
  });

  describe('posts', async() => {
    let result, postCount;

    before(async() => {
      result = await socialThread.createPost('This is my first Post', { from: author });
      postCount = await socialThread.postCount();
    });

    it('Creates posts', async() => {
      // SUCCESS
      assert.equal(postCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct');
      assert.equal(event.content, 'This is my first Post', 'content is correct');
      assert.equal(event.tipAmount, '0', 'tip amount is correct');
      assert.equal(event.author, author, 'author is correct');

      // FAILURE (Post has no content)
      await socialThread.createPost('', { from: author }).should.be.rejected;
    });

  });

});