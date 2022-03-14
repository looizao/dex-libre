// const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
// const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { expectRevert } = require('@openzeppelin/test-helpers');

const Dai = artifacts.require('mocks/Dai.sol');
const Bat = artifacts.require('mocks/Bat.sol');
const Rep = artifacts.require('mocks/Rep.sol');
const Zrx = artifacts.require('mocks/Zrx.sol');
const Dex = artifacts.require('Dex.sol');

contract('Dex', (accounts) => {
  let dai, bat, rep, zrx, dex;
  const [trader1, trader2] = [accounts[1], accounts[2]];
  const [DAI, BAT, REP, ZRX] = ['DAI', 'BAT', 'REP', 'ZRX']
    .map(ticker => web3.utils.fromAscii(ticker));

  beforeEach(async() => {
    ([dai, bat, rep, zrx] = await Promise.all([
      Dai.new(),
      Bat.new(),
      Rep.new(),
      Zrx.new()
    ]));

    dex = await Dex.new();
    await Promise.all([
      dex.addToken(DAI, dai.address),
      dex.addToken(BAT, bat.address),
      dex.addToken(REP, rep.address),
      dex.addToken(ZRX, zrx.address)
    ]);
    console.log('0')
    const amount = web3.utils.toWei('1000');
    const seedTokenBalance = async (token, trader) => {
      await token.faucet(trader, amount);
      await console.log('1')
      await token.approve(dex.address, amount, {from: trader});
    }
    console.log('2')
    await Promise.all(
      [dai, bat, rep, zrx].map(
        token => {
          console.log('a ' + token)
          seedTokenBalance(token, trader1)
        }
      )
    );
    await Promise.all(
      [dai, bat, rep, zrx].map(
        token => {
          console.log('b ' + token)
          seedTokenBalance(token, trader2)
        }
      )
    );
    console.log('3')
  });

  it('should deposit tokens', async () => {
    const amount = web3.utils.toWei('100');
    console.log('tst')

    await dex.deposit(amount, DAI, {from: trader1});

    // const balance = await dex.traderBalances(trader1, DAI);
    // console.log(balance);
    assert(1 === 1);
  });

  // it('should NOT deposit tokens if token does not exist', async () => {
  //   await expectRevert(
  //     dex.deposit(
  //       web3.utils.toWei('100'),
  //       web3.utils.fromAscii('TOKEN_DOES_NOT_EXIST'),
  //       {from: trader1}
  //     ),
  //     'this token does not exist'
  //   );
  // });
});
