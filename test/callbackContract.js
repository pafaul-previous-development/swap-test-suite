const freeton = require('../src');
const { expect } = require('chai');
const logger = require('mocha-logger');

class CallbackContract {
    /**
     * 
     * @param {freeton.TonWrapper} tonInstance 
     * @param {JSON} giverParameters 
     * @param {JSON} keyPair 
     */
    constructor(tonInstance, callbackContractParams, keyPair) {
        this.tonInstance = tonInstance;
        this.keyPair = keyPair;
        this.initParams = callbackContractParams.initParams;
        this.constructorParams = callbackContractParams.constructorParams;
        this.callbackContract = undefined;
    }

    async loadContract() {
        this.callbackContract = await freeton.requireContract(this.tonInstance, 'CallbackTestContract');
    }

    async deployContract() {
        return await this.callbackContract.deploy(
            this.constructorParams,
            this.initParams,
            freeton.utils.convertCrystal('4', 'nano'),
            true,
            this.keyPair
        );
    }

    /**
     * Get result of callback call
     */
    async getResult() {
        let result = await this.callbackContract.run(
            'getResult', {},
            this.keyPair
        );
        return result;
    }
}

module.exports = CallbackContract;