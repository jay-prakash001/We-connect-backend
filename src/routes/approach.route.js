import {Router} from 'express';
import { verifyJwt } from '../middlewares/verifyJwt.middleware.js';
import {createApproach, get_approach_worker,get_approach_user, deleteApproach} from '../controllers/approach.controllers.js'
const router = Router()

router.route('/test').get((req, res)=>{
    res.write('hello test')
    res.end()
})

router.route('/create_approach').post(verifyJwt, createApproach)

router.route('/get_approach_worker').get(verifyJwt, get_approach_worker)

router.route('/get_approach_users').get(verifyJwt, get_approach_user)

router.route('/delete_approach').delete(verifyJwt, deleteApproach)
export default router