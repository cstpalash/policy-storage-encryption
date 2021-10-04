const jp = require('jsonpath');

exports.handler = async function(event, context) {
  
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  console.log('## CONTEXT: ' + serialize(context));
  console.log('## EVENT: ' + serialize(event));

  switch(event.action){
    case 'validate-aws-s3-encryption-configuration':
    {
      if(exports.checkForEncryption(event) === false)
        return { policyId : "xxxxCS-154-056", valid : false, message : 'storage is not encrypted' };

      var expectedAlgo = getExpectedEncryptionAlgorithm(event);

      if(exports.checkForEncryptionAlgorithm(event) != expectedAlgo)
        return { policyId : "xxxxCS-154-056", valid : false, message : `storage is not encrypted with expected algorithm [${expectedAlgo}]` };

      return { policyId : "xxxxCS-154-056", valid : true, message : '' };
      break;
    }
    case 'get-chaos-engineering-step':
      return exports.getChaosEngineeringSteps(event);
      break;

    case 'validate-aws-s3-encryption-configuration-pre-provision':
      {
        let configurations = exports.getAllBucketConfigFromPlan(event);

        if(configurations.length == 0)
          return  { policyId : "xxxxCS-154-056", valid : true, message : '' }; //no related config found

        var nonEncryptedBuckets = [];
        let expectedAlgo = getExpectedEncryptionAlgorithm(event);

        configurations.forEach(config => {
          
          let algo = exports.getSSEAlgo(config);
          

          if(algo != expectedAlgo)
            nonEncryptedBuckets.push(config.bucket);

        });

        if(nonEncryptedBuckets.length > 0)
          return { policyId : "xxxxCS-154-056", valid : false, message : `storage is not encrypted with expected algorithm [${expectedAlgo}] : ${nonEncryptedBuckets.toString()}` };
      
        return { policyId : "xxxxCS-154-056", valid : true, message : '' };
      }
      break;
    default:
      break;
  }
  
}

exports.getChaosEngineeringSteps = function(event){
  switch(event.previousStatus){
    case "None":
    case "Completed":
      return [ 
        { step : "createNonCompliantResource" }, 
        { step : "addStatus", params : { status : "Initiated" } } 
      ];
      break;
    case "Initiated":
      return [ 
        { 
          step : "CheckComplianceStatusOfCreatedResource", 
          responses : [
            { 
              valid : false, 
              nextSteps : [ 
                { step : "addStatus", params : { status : "Completed" } },
                { step : "cleanUp" }
              ]
            },
            { 
              valid : true, 
              nextSteps : [ 
                { step : "addStatus", params : { status : "Initiated" } },
              ]
            }
          ]
        } 
      ];
      break;
  }
}

exports.getAllBucketConfigFromPlan = function(event){

  switch(event.action){
    case 'validate-aws-s3-encryption-configuration-pre-provision':
      return getAllBucketConfigFromPlan_AWS_S3(event);
      break;
    default:
      return false;
      break;
  }

}

exports.checkForEncryption = function(event){

  switch(event.action){
    case 'validate-aws-s3-encryption-configuration':
      return checkForEncryption_AWS_S3(event);
      break;
    default:
      return false;
      break;
  }

}

exports.checkForEncryptionAlgorithm = function(event){

  switch(event.action){
    case 'validate-aws-s3-encryption-configuration':
      return checkForEncryptionAlgorithm_AWS_S3(event);
      break;
    default:
      return '';
      break;
  }

  return '';

}

function getExpectedEncryptionAlgorithm(event){
  switch(event.action){
    case 'validate-aws-s3-encryption-configuration':
    case 'validate-aws-s3-encryption-configuration-pre-provision':
      return 'aws:kms';
      break;
    default:
      return '';
      break;
  }
}

// ################################# AWS S3 pre provision - start #################################

function getAllBucketConfigFromPlan_AWS_S3(event){
  return jp.query(event, "$.metadata..after");
}

exports.getSSEAlgo = function (bucketConfig){
  if(bucketConfig &&
    bucketConfig.server_side_encryption_configuration &&
    bucketConfig.server_side_encryption_configuration.length > 0 &&
    bucketConfig.server_side_encryption_configuration[0].rule.length > 0 &&
    bucketConfig.server_side_encryption_configuration[0].rule[0].apply_server_side_encryption_by_default.length > 0){
      return bucketConfig.server_side_encryption_configuration[0].rule[0].apply_server_side_encryption_by_default[0].sse_algorithm;
  }
  else
    return "";
}

// ################################# AWS S3 pre provision - end #################################

// ################################# AWS S3 continuous compliance - start #################################

function checkForEncryption_AWS_S3(event){

  if(event.metadata &&
    event.metadata.ServerSideEncryptionConfiguration &&
    event.metadata.ServerSideEncryptionConfiguration.Rules &&
    event.metadata.ServerSideEncryptionConfiguration.Rules.length > 0 &&
    event.metadata.ServerSideEncryptionConfiguration.Rules[0].BucketKeyEnabled === true){

    return true;
  }

  return false;

}

function checkForEncryptionAlgorithm_AWS_S3(event){

  if(event.metadata &&
    event.metadata.ServerSideEncryptionConfiguration &&
    event.metadata.ServerSideEncryptionConfiguration.Rules &&
    event.metadata.ServerSideEncryptionConfiguration.Rules.length > 0 &&
    event.metadata.ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault &&
    event.metadata.ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm){

    return event.metadata.ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm;
  }

  return '';
  
}

// ################################# AWS S3 continuous compliance - end #################################

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}
