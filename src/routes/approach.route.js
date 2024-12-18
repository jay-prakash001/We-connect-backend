import {Router} from 'express';
import { verifyJwt } from '../middlewares/verifyJwt.middleware.js';
import {createApproach} from '../controllers/approach.controllers.js'
const router = Router()

router.route('/test').get((req, res)=>{
    res.write('hello test')
    res.end()
})

router.route('/create_approach').post(verifyJwt, createApproach)

export default router