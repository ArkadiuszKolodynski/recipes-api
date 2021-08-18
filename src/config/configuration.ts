export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'http://172.24.97.84:9200',
  jwtSecret: process.env.JWT_SECRET || 'JWT_SECRET',
  jwtExpiration: process.env.JWT_EXPIRATION || 'JWT_EXPIRATION',
});
