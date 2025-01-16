const fruitGrid = require("../functions/fruitGrid");

/* GET home page. */
var newFruitGrid = new fruitGrid();
class FruitService {
  constructor(db) {
    this.client = db.sequelize;
    this.fruit = db.fruit;
  }
  async create() {
    newFruitGrid.initGrid();
    return await this.fruit.create({
      fruitgrid: newFruitGrid.stringifyFruits(),
    });
  }

  async update(fruitGrid) {
    return await this.fruit.update(
      {
        fruitgrid: fruitGrid,
      },
      {
        where: {
          id: 1,
        },
      }
    );
  }

  async getAll() {
    return await this.fruit.findAll({ where: {} });
  }
  async getOne(id) {
    return await this.fruit.findOne({
      where: {
        id: id,
      },
    });
  }
}

module.exports = FruitService;
