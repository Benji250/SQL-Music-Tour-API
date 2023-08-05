const bands = require('express').Router();
const db = require('../models');
const { Band, MeetGreet, Event, SetTime } = db;
const { Op } = require('sequelize')

//Get all Band
bands.get('/', async (req, res) => {
	try {
		const foundBands = await Band.findAll({
			order: [ ( 'available_start_time', 'ASC' ) ],
			where: {
				name: { 
					[Op.like]: `%${req.query.name ? req.query.name : ''}%` }
				}
		});
		res.status(200).json(foundBands);
	} catch (e) {
		res.status(500).json(e);
	}
});

//Get One Band
//* GET ONE BAND
bands.get('/:name', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            where: { name: req.params.name },
            include: [
            { 
                model: MeetGreet, 
                as: 'meet_greets',
                include: { model: Event, 
                as: 'event',
                where: { name: { [Op.like]:  `%${req.query.event ? req.query.event : ''}%` }}
                }
            },
            {
                model: SetTime,
                as: 'set_times',
                include: { 
                    model: Event, 
                    as: 'event',
                    where: { name: { [Op.like]:  `%${req.query.event ? req.query.event : ''}%` }}
                }
            }
        ]
        })
        res.status(200).json(foundBand)
    } catch(e) {
        res.status(500).json(e)
    }
})

//Create Band
bands.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body)
        res.status(200).json(newBand)
    } catch(e) {
        res.status(500).json(e)
    }
})

//Update Band
bands.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(req.body, {
            where: { band_id: req.params.id }
        })
        res.status(200).json({
            message: `Updated ${updatedBands} bands`
        })
    } catch(e) {
        res.status(500).json(e)
    }
})

//Delete Band 
bands.delete('/:id', async (req, res) => {
	try {
		const deletedBands = await Band.destroy({
			where: { band_id: req.params.id },
		});
		res.status(200).json({
			message: `Deleted ${deletedBands} bands`,
		});
	} catch (e) {
		res.status(500).json(e);
	}
});

module.exports = bands;