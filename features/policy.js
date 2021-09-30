const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const implementation = require('../app.js');

// Implementation : aws.s3 - Continuous Compliance

Given('I receive CreateBucket, PutBucketEncryption or DeleteBucketEncryption events for an aws.s3 bucket and then fetch encryption configuration of that bucket in {string}', function (string) {
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

// Implementation : aws.s3 - Chaos Engineering

Given('I receive previous chaos engineering status is {string} in {string}', function (previousStatus, environment) {
	this.event = require('./mock/aws.s3.chaos.json');
	this.event.previousStatus = previousStatus;
});
       
When('I check for next executable steps', function () {
   this.nextSteps = implementation.getChaosEngineeringSteps(this.event);

});

Then('next steps are {string} and {string} with param {string}', function (step1, step2, paramValue) {
   assert.strictEqual(step1, this.nextSteps[0].step);
   assert.strictEqual(step2, this.nextSteps[1].step);
   assert.strictEqual(paramValue, this.nextSteps[1].params.status);
});
       
Then('next step is {string}, if non-compliant, nextSteps are {string} with params {string} and {string}, otherwise {string} with params {string}', function (step, nonComplientStep1, nonComplientStep1Param, nonComplientStep2, complientStep1, complientStep1Param) {
   assert.strictEqual(step, this.nextSteps[0].step);

   var nonCompliantResponse = this.nextSteps[0].responses.find(item => { return item.valid == false; });
   var compliantResponse = this.nextSteps[0].responses.find(item => { return item.valid == true; });

   assert.strictEqual(nonComplientStep1, nonCompliantResponse.nextSteps[0].step);
   assert.strictEqual(nonComplientStep1Param, nonCompliantResponse.nextSteps[0].params.status);
   assert.strictEqual(nonComplientStep2, nonCompliantResponse.nextSteps[1].step);

   assert.strictEqual(complientStep1, compliantResponse.nextSteps[0].step);
   assert.strictEqual(complientStep1Param, compliantResponse.nextSteps[0].params.status);

});     


