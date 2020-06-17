export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27018/clean-node-api',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'tj670==5H'
}
