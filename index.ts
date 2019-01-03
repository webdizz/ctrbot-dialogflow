import { Request, Response } from 'express'

export function webhook(req: Request, res: Response) {
    console.log(req)

    res.status(200).type("application/json").send('{"result":"OK"')
}