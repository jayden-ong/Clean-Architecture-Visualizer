import { Router } from "express";
import { SessionDBAccess } from "../../data_access/sessionDBAccess.js";
import { CleanArchAccess } from "../../data_access/cleanArchInfoAccess.js";
const router = Router();

const dbAccess = new SessionDBAccess();
const cleanArchAccess = new CleanArchAccess();

router.get("/analysis/summary",  (_req, res) => {
    // const presenter = new APIPresenter(outputData);
    // controller.getProjectSummary();
    // res.json(presenter.getOutputData());
})

export default router;