/** =====================================================================
 *  TICKET ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getTicket, getTicketId, createTicket, updateTicket, searchTicket } = require('../controllers/tickets.controller');

const router = Router();

/** =====================================================================
 *  POST TICKETS
=========================================================================*/
router.post('/query', getTicket);

/** =====================================================================
 *  GET TICKET ID
=========================================================================*/
router.get('/:id', validarJWT, getTicketId);

/** =====================================================================
 *  GET SEARCH TICKET
=========================================================================*/
router.get('/search/:rifa/:busqueda', validarJWT, searchTicket);

/** =====================================================================
 *  POST CREATE TICKET
=========================================================================*/
router.post('/', [
        validarJWT,
        check('monto', 'El monto es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createTicket
);

/** =====================================================================
 *  PUT TICKET
=========================================================================*/
router.put('/:id', validarJWT, updateTicket);

// EXPORT
module.exports = router;