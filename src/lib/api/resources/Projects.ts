import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { Project } from "../../../types/api/projects";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ProjectsApi {
  private client: AxiosInstance;

  private projectsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.projectsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects`;
  }

  /**
   * Creates new project.
   */
  public async create(projectName: string) {
    const data = { project: { name: projectName } };

    return this.client.post<Project, Project>(this.projectsURL, data);
  }

  /**
   * Lists projects and their sandboxes to which the API token has access.
   */
  public async getList() {
    return this.client.get<Project[], Project[]>(this.projectsURL);
  }

  /**
   * Gets the project and its sandboxes.
   */
  public async getById(projectId: number) {
    const url = `${this.projectsURL}/${projectId}`;

    return this.client.get<Project, Project>(url);
  }

  /**
   * Updates project name. The project name is min 2 characters and max 100 characters long.
   */
  public async update(projectId: number, updatedName: string) {
    const url = `${this.projectsURL}/${projectId}`;
    const data = { project: { name: updatedName } };

    return this.client.patch<Project, Project>(url, data);
  }

  /**
   * Deletes a project by its ID.
   */
  public async delete(projectId: number) {
    const url = `${this.projectsURL}/${projectId}`;

    return this.client.delete<Project, Project>(url);
  }
}
