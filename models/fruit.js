module.exports = (sequelize, Sequelize) => {
  const fruit = sequelize.define(
    "fruit",
    {
      fruitgrid: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return fruit;
};
