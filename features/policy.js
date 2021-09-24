const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const implementation = require('../app.js');

// Implementation : aws.s3 - Continuous Compliance

Given('I receive CreateBucket, PutBucketEncryption and DeleteBucketEncryption events and fetch encryption configuration of that aws.s3 bucket in {string}', function (environment) {
	this.event = require('./mock/aws.s3.encryption.json');
});

When('I check for BucketKeyEnabled and SSEAlgorithm', function () {

	this.actualEncryption = implementation.checkForEncryption(this.event);
	this.actualEncryptionAlgorithm = implementation.checkForEncryptionAlgorithm(this.event);

});

Then('BucketKeyEnabled should be {string} and SSEAlgorithm should be {string}', function (expectedBucketKeyEnabled, expectedSSEAlgorithm) {

	assert.strictEqual(this.actualEncryption.toString(), expectedBucketKeyEnabled);
	assert.strictEqual(this.actualEncryptionAlgorithm, expectedSSEAlgorithm);

});