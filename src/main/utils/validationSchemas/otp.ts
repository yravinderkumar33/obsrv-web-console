export default {
  name: 'otp',
  schemas: {
    generate: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Login',
      type: 'object',
      properties: {
        email: {
          type: 'string',
          pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        },
        mobile: {
          type: 'object',
          properties: {
            countryCode: {
              type: 'string',
            },
            number: {
              type: 'string',
            },
          },
          required: ['countryCode', 'number'],
        },
      },
      oneOf: [
        {
          required: ['email'],
        },
        {
          required: ['mobile'],
        },
      ],
    },
  },
};
