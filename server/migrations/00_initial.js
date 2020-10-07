const { DataTypes } = require('sequelize');

async function up(queryInterface) {
	await queryInterface.createTable('properties', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		extra_data: {
			type: DataTypes.JSONB,
			allowNull: true
		},
		footprint: {
			type: DataTypes.GEOMETRY('POLYGON', 4326),
			allowNull: true
        },
        long_lat: {
			type: DataTypes.GEOMETRY('POINT', 4326),
			allowNull: true
        },
        ubid: {
			type: DataTypes.STRING,
			allowNull: true
        },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	});
	await queryInterface.createTable('tax_lots', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		extra_data: {
			type: DataTypes.JSONB,
			allowNull: true
		},
		footprint: {
			type: DataTypes.GEOMETRY('POLYGON', 4326),
			allowNull: true
        },
        ulid: {
			type: DataTypes.STRING,
			allowNull: true
        },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	});
}

async function down(queryInterface) {
	await queryInterface.dropTable('properties');
	await queryInterface.dropTable('tax_lots');
}

module.exports = { up, down };