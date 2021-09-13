exports.handler = async function(event, context) {
  
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  console.log('## CONTEXT: ' + serialize(context));
  console.log('## EVENT: ' + serialize(event));
  

  if(exports.checkForEncryption(event) === false)
    return { valid : false, message : 'storage is not encrypted' };

  var expectedAlgo = getExpectedEncryptionAlgorithm(event);

  if(exports.checkForEncryptionAlgorithm(event) != expectedAlgo)
    return { valid : false, message : `storage is not encrypted with expected algorithm [${expectedAlgo}]` };

  return { valid : true, message : '' };
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
      return 'aws:kms';
      break;
    default:
      return '';
      break;
  }
}

// ################################# AWS S3 RUNNING - start #################################

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

// ################################# AWS S3 RUNNING - end #################################

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}
