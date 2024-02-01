const { response } = require('express');

const Ticket = require('../models/ticket.model');

/** =====================================================================
 *  SEARCH TICKET FOR CLIENT
=========================================================================*/
const searchTicket = async(req, res = response) => {

    try {

        const busqueda = req.params.busqueda;
        const rifa = req.params.rifa;

        const regex = new RegExp(busqueda, 'i');

        const tickets = await Ticket.find({
            $or: [
                { nombre: regex },
                { telefono: regex },
                { cedula: regex },
            ],
            rifa
        })

        res.json({
            ok: true,
            tickets,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


/** =====================================================================
 *  GET TICKET
=========================================================================*/
const getTicket = async(req, res) => {

    try {

        const { desde, hasta, sort, ...query } = req.body;

        const [tickets, total, disponibles, apartados, pagados] = await Promise.all([
            Ticket.find(query)
            .populate('vendedor')
            .sort(sort)
            .limit(hasta)
            .skip(desde),
            Ticket.countDocuments({ rifa: query.rifa }),
            Ticket.countDocuments({ rifa: query.rifa, estado: 'Disponible' }),
            Ticket.countDocuments({ rifa: query.rifa, estado: 'Apartado' }),
            Ticket.countDocuments({ rifa: query.rifa, estado: 'Pagado' }),
        ]);

        res.json({
            ok: true,
            tickets,
            total,
            disponibles,
            apartados,
            pagados
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};


/** =====================================================================
 *  GET TICKET ID
=========================================================================*/
const getTicketId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const ticketDB = await Ticket.findById(id)
            .populate('ruta')
            .populate('vendedor');
        if (!ticketDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este ticket, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            ticket: ticketDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  CREATE TICKET
=========================================================================*/
const createTicket = async(req, res = response) => {

    try {

        const uid = req.uid;

        // SAVE TASK
        const ticket = new Ticket(req.body);

        await ticket.save();

        res.json({
            ok: true,
            ticket
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
};


/** =====================================================================
 *  UPDATE TICKET
=========================================================================*/
const updateTicket = async(req, res = response) => {

    const tid = req.params.id;

    try {

        // SEARCH TICKET
        const ticketDB = await Ticket.findById(tid);
        if (!ticketDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun ticket con este ID'
            });
        }
        // SEARCH TICKET

        // VALIDATE TICKET
        let {...campos } = req.body;

        // UPDATE
        await Ticket.findByIdAndUpdate(tid, campos, { new: true, useFindAndModify: false });

        const ticketUpdate = await Ticket.findById(tid)
            .populate('ruta')
            .populate('vendedor');

        res.json({
            ok: true,
            ticket: ticketUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};

// EXPORTS
module.exports = {
    getTicket,
    getTicketId,
    createTicket,
    updateTicket,
    searchTicket
};