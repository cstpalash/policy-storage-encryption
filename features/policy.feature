Feature: xxxxCS-154-056 (MOD.EKM.C)

# Level : Mod | Category : Encryption & Key Management | Owner : Cyber

# Requirement : XXXX must ensure that XXXX data is encrypted at-rest at all times using application-level, database, object storage or volume encryption for all Information Elements that are included within the “Confidential” Information Confidentiality Classification Level. Disk level encryption alone is not acceptable.

# Mechanism : Data which is rated confidential and above must employ encryption at-rest utilizing a KMS with xxxx BYOK.


	# Implementation : aws.s3 - Continuous Compliance 

	Scenario Outline: ["<environment>"] While an AWS S3 bucket is up and running, it should be encrypted by AWS KMS managed key 
		Given I receive CreateBucket, PutBucketEncryption or DeleteBucketEncryption events for an aws.s3 bucket and then fetch encryption configuration of that bucket in "<environment>"  
		When I check for BucketKeyEnabled and SSEAlgorithm
		Then BucketKeyEnabled should be "true" and SSEAlgorithm should be "aws:kms"

	Examples:
	| environment	|
	| dev			|
	| uat			|
	| prod			|

	# Implementation : aws.s3 - Chaos Engineering

	Scenario Outline: ["<environment>"] When I check chaos engineering status for an AWS S3 bucket, if previous status is None, I should create new resource and add Initiated status   
		Given I receive previous chaos engineering status is "None" in "<environment>"  
		When I check for next executable steps
		Then next steps are "createNonCompliantResource" and "addStatus" with param "Initiated"

	Examples:
	| environment	|
	| dev			|
	| uat			|
	| prod			|

	Scenario Outline: ["<environment>"] When I check chaos engineering status for an AWS S3 bucket, if previous status is Completed, I should create new resource and add Initiated status   
		Given I receive previous chaos engineering status is "Completed" in "<environment>"  
		When I check for next executable steps
		Then next steps are "createNonCompliantResource" and "addStatus" with param "Initiated"

	Examples:
	| environment	|
	| dev			|
	| uat			|
	| prod			|

	Scenario Outline: ["<environment>"] When I check chaos engineering status for an AWS S3 bucket, if previous status is Initiated, I should check whether the resource became non-complient, if yes, shall add Completed status and cleanup, otherwise add Initiated status   
		Given I receive previous chaos engineering status is "Initiated" in "<environment>"  
		When I check for next executable steps
		Then next step is "CheckComplianceStatusOfCreatedResource", if non-compliant, nextSteps are "addStatus" with params "Completed" and "cleanUp", otherwise "addStatus" with params "Initiated"

	Examples:
	| environment	|
	| dev			|
	| uat			|
	| prod			|