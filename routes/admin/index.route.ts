import { Express } from "express";
import { dashboardRoute }from "./dashboard.route";
import {systemConfig} from "../../config/system";

export const routesAdmin = (app: Express) => {
  const PATH = `/${systemConfig.prefixAdmin}`;

  app.use(`${PATH}/dashboard`, dashboardRoute);
}