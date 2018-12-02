// External Dependencies
import * as express from 'express'
// Internal Dependencies
import * as projectsStorage from '../storage/projectsStorage'
import * as usersStorage from '../storage/usersStorage'

/*********************
 **      Logic      **
 *********************/

/**
 * Add blank project to user
 * @param req - express request object
 * @param req.body - request body
 * @param req.body.project - project info to save
 * @param res - express response object
 */
export function addProject(
  req: express.Request,
  res: express.Response
) {
    console.log(req.body)
  return projectsStorage
    .createProject(req.body.project)
    .then((puid) => res.status(200).send({ puid }))
    .catch(err => {
      console.log(err)
      return res.status(500).send('Server Error')
    })
}

/**
 * Get all projects for user
 * @param req - express request object
 * @param req.query - request url query params
 * @param req.query.uuid - user to get projects for
 * @param res - express response object
 */
export function getProjects(req: express.Request, res: express.Response) {
  return projectsStorage
    .getProjects(req.query.uuid)
    .then(projects => res.status(200).send({ projects }))
    .catch(err => {
      console.error(err)
      return res.status(500).send('Server Error')
    })
}

/**
 * Remove project
 * @param req - express request object
 * @param req.body - request url query params
 * @param req.body.puid - project id to delete
 * @param res - express response object
 */
export function removeProject(
  req: express.Request,
  res: express.Response
) {
    return projectsStorage
        .deleteProjects(req.body.puid)
        .then(() => res.status(200))
        .catch(err => {
            console.error(err);
            return res.status(500).send("Server Error");
        });
}

/**
 * Get basic usecase template
 * @param req - express request object
 * @param res - express response object
 */
export function getTemplate(req: express.Request, res: express.Response) {
  return projectsStorage
    .getTemplate()
    .then(template => res.status(200).send({ template }))
    .catch(err => {
      console.error(err)
      return res.status(500).send('Server Error')
    })
}

export async function shareProjects(req: express.Request, res: express.Response) {
    const usersToShareTo = req.body.users;
    const projectId = req.body.id
    return usersToShareTo.forEach(newUser => {
        projectsStorage.UpdateProjectUsers(projectId,newUser)
        .then(() => usersStorage.addUserProject(newUser.user,projectId))
        .then(() => res.status(200).send())
        .catch(err => {
            console.log(err)
            return res.status(500).send('Server Error')
        })
    });
}

export async function saveProjects(
    req: express.Request,
    res: express.Response
  ) {
    return projectsStorage
      .updateProject(req.body.project,req.params.puid)
      .then(() => res.status(200).send())
      .catch(err => {
        console.log(err)
        return res.status(500).send('Server Error')
      })
  }