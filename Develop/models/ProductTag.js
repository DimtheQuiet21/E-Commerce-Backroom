const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key:'id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tag',
        key:'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag', //THIS is what you call to summon the model.
  }
);

module.exports = ProductTag;
