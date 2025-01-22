module.exports = (sequelize, Sequelize) => {
  const fruit = sequelize.define(
    "score",
    {
      score: {
        type: Sequelize.DataTypes.NUMERIC,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return fruit;
};
