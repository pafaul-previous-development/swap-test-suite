const freeton = require('../src');
const { expect } = require('chai');
const logger = require('mocha-logger');

class Wallet {
    /**
     * 
     * @param {freeton.TonWrapper} tonInstance 
     * @param {JSON} rootParameters 
     * @param {JSON} keyPair 
     */
    constructor(tonInstance, walletParams, keyPair) {
        this.tonInstance = tonInstance;
        this.keyPair = keyPair;
        this.initParams = walletParams.initParams;
        this.constructorParams = walletParams.constructorParams;
        this.walletContract = undefined
    }

    /**
     * Load contract. Requires .code, .base64, .abi.json, .tvc(probably)
     */
    async loadContract() {
        this.walletContract = await freeton.requireContract(this.tonInstance, 'TONTokenWallet');

        expect(this.walletContract.address).to.equal(undefined, 'Address should be undefined');
        expect(this.walletContract.code).not.to.equal(undefined, 'Code should be available');
        expect(this.walletContract.abi).not.to.equal(undefined, 'ABI should be available');
    }

    /**
     * Set wallet address
     * @param {String} walletAddress 
     */
    setWalletAddress(walletAddress) {
        this.walletContract.address = walletAddress;
    }

    /**
     * Set callback address for deployed wallet
     * @param {String} address Callback contract address
     */
    async setCallbackAddress(address) {
        return await this.walletContract.run(
            'setReceiveCallback', {
                receive_callback_: address
            },
            this.keyPair
        );
    }

    /**
     * Transfer tokens
     * @param {String} address
     * @param {Number} tokens 
     */
    async transfer(address, tokens) {
        await this.walletContract.run(
            'transfer', {
                to: address,
                tokens: tokens,
                grams: freeton.utils.convertCrystal('0.2', 'nano')
            },
            this.keyPair
        );
    }

    /**
     * Token transfer with notify of callback contract
     * @param {String} address 
     * @param {Number} tokens 
     */
    async transferWithNotify(address, tokens) {
        await this.walletContract.run(
            'transferWithNotify', {
                to: address,
                tokens: tokens,
                grams: freeton.utils.convertCrystal('0.2', 'nano'),
                payload: ''
            },
            this.keyPair
        );
    }
}

module.exports = Wallet;