module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "John",
        email: "john@example.com",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane",
        email: "jane@example.com",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
