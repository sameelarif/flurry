import * as Store from "electron-store";
import Defaults from "./_devDefault";
import Tasks from "./../tasks/taskManager";

class ApplicationStore {
  constructor() {
    this.store = new Store({
      name: "FlurryGen2",
    });

    this.auth = null;
    this.tasks = new Tasks(this.store);
  }

  removeKey(key) {
    this.store.delete(key);
  }

  setAuth(auth) {
    this.auth = auth;
  }

  getAuth() {
    return this.auth;
  }
  getTasks() {
    return this.tasks.getTasks();
  }
  getDashboard() {
    return this.store.get("dash") || Defaults.dash;
  }
  getAccounts() {
    return this.store.get("accounts") || Defaults.accounts;
  }
  getProxies() {
    return this.store.get("proxies") || Defaults.proxies;
  }
  getProfiles() {
    return this.store.get("profiles") || Defaults.profiles;
  }
  getEmails() {
    return this.store.get("proxies") || Defaults.proxies;
  }
  getSettings() {
    return this.store.get("settings") || Defaults.settings;
  }
  getWebhook() {
    return this.store.get("settings")?.webHookUrl || null;
  }

  saveKey(auth, id) {
    this.store.set("license", auth);

    if (id) this.store.set("discordId", id);
  }

  getKey() {
    return this.store.get("license");
  }

  getDiscordId() {
    return this.store.get("discordId");
  }

  setTasks(data) {
    this.tasks.set(data);
    this.tasks.render();
  }
  setSettings(data) {
    this.store.set("settings", data);
  }
  setAccounts(data) {
    this.store.set("accounts", data);
  }
  setProxies(data) {
    this.store.set("proxies", data);
  }
  setProfiles(data) {
    this.store.set("profiles", data);
  }
  setDashboard(data) {
    this.store.set("dash", data);
  }
  setEmails(data) {
    this.store.set("proxies", data);
  }
  setKey(data) {
    this.store.set("license", data);
  }

  saveTasks() {
    this.store.set("tasks", this.getTasks());
  }
}

export default new ApplicationStore();
