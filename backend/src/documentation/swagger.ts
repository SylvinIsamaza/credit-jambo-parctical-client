const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Credit Jambo API',
    version: '1.0.0',
    description: 'Banking API with savings, security, and user management'
  },
  host: 'localhost:5000',
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and registration'
    },
    {
      name: 'Savings',
      description: 'Savings account operations and transactions'
    },
    {
      name: 'Security',
      description: 'PIN management, OTP, and account limits'
    },
    {
      name: 'User Management',
      description: 'User profile and account management'
    },
    {
      name: 'Admin',
      description: 'Administrative functions and user management'
    },
    {
      name: 'Contact',
      description: 'Customer support and messaging'
    },
    {
      name: 'Statements',
      description: 'Account statements and reports'
    }
  ],
  definitions: {
    TransactionDto: {
      amount: 1000.50,
      description: 'ATM withdrawal'
    },
    TransactionPinDto: {
      transactionId: 'tx123',
      pin: '1234'
    },
    SetPinDto: {
      pin: '1234'
    },
    UpdateProfileDto: {
      firstName: 'John',
      lastName: 'Doe',

      dateOfBirth: '1990-01-01'
    },
    CreateContactDto: {
      title: 'Transaction Issue',
      message: 'I have a problem with my withdrawal',
      transactionRefId: 'TXN2512345001'
    }
  }
};

const outputFile = './src/documentation/swagger-output.json';
const endpointsFiles = [
  './src/routes/index.ts',
  
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});