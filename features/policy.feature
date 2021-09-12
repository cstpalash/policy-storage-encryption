Feature: Is storage encrypted by self managed cryptographic key?
	Storage should be encrypted by self managed cryptographic key


	################################# AWS S3 PROVISIONING - start #################################

	################################# AWS S3 PROVISIONING - end #################################

	################################# AWS S3 RUNNING - start #################################

	Scenario Outline: ["<environment>"] While an AWS S3 bucket is up and running, it should be encrypted by AWS KMS managed key 
		Given encryption configuration of AWS S3 bucket in "<environment>"
		When checked for BucketKeyEnabled and SSEAlgorithm
		Then BucketKeyEnabled should be "true" and SSEAlgorithm should be "aws:kms"

	Examples:
    | environment	|
    | dev 			|		
    | uat 			|
    | prod 			|

    ################################# AWS S3 RUNNING - end #################################