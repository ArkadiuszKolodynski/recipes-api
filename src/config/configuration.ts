export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  jwtSecret: process.env.JWT_SECRET || 'JWT_SECRET',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
});
