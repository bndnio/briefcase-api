// External Dependencies
import * as express from 'express'
// Internal Dependencies
import * as authStorage from '../storage/authStorage'
import * as usersStorage from '../storage/usersStorage'
import { ROLES } from '../constants';

/*********************
 **      Logic      **
 *********************/

/**
 * Verify user with username and password
 * @param req - express request object
 * @param req.body - request body
 * @param req.body.username - username
 * @param req.body.password - password
 * @param res - express response object
 */
export async function verifyUser(req: express.Request, res: express.Response) {
  const { username, password } = req.body

  authStorage
    .readUser(username)
    .then(record => {
      // 400 if no matching record
      if (record === null) {
        return res.status(400).send('No user with username available')

        // if password match, save token to auth collection, disabeling passswords for time being - Dylan
      } else if (/*`${password}` === record.obj.password*/true) {
        return usersStorage
          .updateUser(record.id)
          .then(() => authStorage.createToken(record.id))
          .then(token => res.status(200).send({
            token,
            id: record.id,
            isAdmin: record.obj.role === ROLES.admin ? true : false
          }))
        // 401 since password doesn't match
      } else {
        return res.status(401).send('invalid password')
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).send('Server Error')
    })
}
