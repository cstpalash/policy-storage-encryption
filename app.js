exports.handler = async function(event, context) {
  
  event.Records.forEach(record => {
    console.log(record.body)
  })
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## CONTEXT: ' + serialize(context))
  console.log('## EVENT: ' + serialize(event))
  
  
  return { hello : "WORLD" };
}

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}
