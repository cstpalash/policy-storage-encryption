Feature: xxxxCS-154-056 (MOD.EKM.C)

# Level : Mod | Category : Encryption & Key Management | Owner : Cyber

# Requirement : XXXX must ensure that XXXX data is encrypted at-rest at all times using application-level, database, object storage or volume encryption for all Information Elements that are included within the “Confidential” Information Confidentiality Classification Level. Disk level encryption alone is not acceptable.

# Mechanism : Data which is rated confidential and above must employ encryption at-rest utilizing a KMS with xxxx BYOK.


	# Implementation : aws.s3 - Continuous Compliance 

	Scenario Outline: ["<environment>"] While an AWS S3 bucket is up and running, it should be encrypted by AWS KMS managed key 
		Given I receive CreateBucket, PutBucketEncryption and DeleteBucketEncryption events and fetch encryption configuration of that aws.s3 bucket in "<environment>"  
		When I check for BucketKeyEnabled and SSEAlgorithm
		Then BucketKeyEnabled should be "true" and SSEAlgorithm should be "aws:kms"

	Examples:
	| environment	|
	| dev			|
	| uat			|
	| prod			|