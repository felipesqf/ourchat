export const handler = async (event: any) => {
  console.log('Event:', JSON.stringify(event));
  
  // Create connection logic
  if (event.requestContext.eventType === 'CONNECT') {
    console.log('Connection established:', event.requestContext.connectionId);
  }

  return {
    statusCode: 200,
  };
};