import {Router} from 'express'
import {verifyJwt} from '../middlewares/verifyJwt.middleware.js'
import {sendChat, getChat} from '../controllers/chat.controllers.js'

const router = Router()
router.route('/test').get((req, res)=>{
    res.write('hello test')
    res.end()
})

router.route('/send_chat').post(verifyJwt,sendChat )
router.route('/get_chat').post(verifyJwt,getChat )


export default router