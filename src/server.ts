import { init, getProjects, addProject, deleteProject, addReport, getReports, deleteReport } from "./db";
import express, {Request, Response} from 'express';

init()

const app = express();
const cors=require('cors');
const bodyparser = require('body-parser');
const port = 4000

app.use(cors())
app.use(bodyparser.json({limit: '50mb'}));

app.get("/api/getProjects", (req: Request, res: Response) => {
  (async () => {
    const projects = await getProjects();
    res.status(200).json(projects);
  })();
});

app.post("/api/newProject", (req: Request, res: Response) => {
  (async () => {
    await addProject(req.body.name);
    res.sendStatus(200);
  })();
})

app.post("/api/newReport", (req: Request, res: Response) => {
  addReport(
    `KW ${req.body.kw}`,
    req.body.project_id,
    req.body.kw,
    req.body.budget,
    req.body.budget_light,
    req.body.time,
    req.body.time_light,
    req.body.quality,
    req.body.quality_light,
    req.body.customer,
    req.body.customer_light,
  ).then((response: any) => {
    res.sendStatus(204)
  }).catch(error => {
    res.status(500).send(`Internal server error: ${error}`);
  })
})

app.post("/api/deleteProject", (req: Request, res: Response) => {
  deleteProject(req.body.id).then((value: boolean) => {
    res.sendStatus(204);
    return;

  }).catch(error => {
    res.status(500).send(`Internal server error: ${error}`);
    return;
  })
})

app.post("/api/getReports", (req: Request, res: Response) => {
  getReports(req.body.id).then((value: any) => {
    console.log(value)
    res.status(200).json(value);
    return;
  });
})

app.post("/api/deleteReport", (req: Request, res: Response) => {
  deleteReport(req.body.id).then((value: boolean) => {
    res.sendStatus(204);
    return;

  }).catch(error => {
    res.status(500).send(`Internal server error: ${error}`);
    return;
  })
})


app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})