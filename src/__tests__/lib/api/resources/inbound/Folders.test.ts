import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import FoldersApi from "../../../../../lib/api/resources/inbound/Folders";
import { Folder } from "../../../../../types/api/inbound/folders";

describe("lib/api/resources/inbound/Folders: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);
  axiosInstance.interceptors.response.use((response) => response.data);

  const foldersAPI = new FoldersApi(axiosInstance);
  const foldersURL = "https://mailtrap.io/api/inbound/folders";

  afterEach(() => mock.reset());

  describe("getList(): ", () => {
    it("returns all folders.", async () => {
      const folders: Folder[] = [
        { id: 1, name: "Support" },
        { id: 2, name: "Sales" },
      ];

      mock.onGet(foldersURL).reply(200, folders);

      const result = await foldersAPI.getList();

      expect(result).toEqual(folders);
    });
  });

  describe("get(): ", () => {
    it("returns a single folder by id.", async () => {
      const folder: Folder = { id: 1, name: "Support" };

      mock.onGet(`${foldersURL}/1`).reply(200, folder);

      const result = await foldersAPI.get(1);

      expect(result).toEqual(folder);
    });
  });

  describe("create(): ", () => {
    it("creates a folder.", async () => {
      const params = { name: "Support" };
      const folder: Folder = { id: 1, name: "Support" };

      mock.onPost(foldersURL, params).reply(201, folder);

      const result = await foldersAPI.create(params);

      expect(result).toEqual(folder);
    });
  });

  describe("update(): ", () => {
    it("updates a folder.", async () => {
      const params = { name: "Customer Success" };
      const folder: Folder = { id: 1, name: "Customer Success" };

      mock.onPatch(`${foldersURL}/1`, params).reply(200, folder);

      const result = await foldersAPI.update(1, params);

      expect(result).toEqual(folder);
    });
  });

  describe("delete(): ", () => {
    it("deletes a folder.", async () => {
      mock.onDelete(`${foldersURL}/1`).reply(204);

      const result = await foldersAPI.delete(1);

      expect(result).toBeUndefined();
    });
  });
});
