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

    it('Lists posts', async() => {
      const post = await socialThread.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct');
      assert.equal(post.content, 'This is my first Post', 'content is correct');
      assert.equal(post.tipAmount, '0', 'tip amount is correct');
      assert.equal(post.author, author, 'author is correct');
    });

    it('Allows users to tip posts', async() => {
      // Track the author balance before purchase
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await socialThread.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') });

      // SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct');
      assert.equal(event.content, 'This is my first Post', 'content is correct');
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct');
      assert.equal(event.author, author, 'author is correct');

      // Check that author received funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipAmount;
      tipAmount = web3.utils.toWei('1', 'Ether');
      tipAmount = new web3.utils.BN(tipAmount);

      const expectedBalance = oldAuthorBalance.add(tipAmount);

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE
      await socialThread.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    });
  });
});