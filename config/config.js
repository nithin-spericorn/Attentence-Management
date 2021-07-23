module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "password123",
    DB: "uk",
    dialect: "mysql",
    SECRET:'secret',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  };
  