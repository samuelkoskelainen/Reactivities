import { action, makeAutoObservable, observable, reaction, runInAction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeAutoObservable(this)

    this.rootStore = rootStore

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt")
        }
      }
    )
  }

  @observable token: string | null = window.localStorage.getItem("jwt");
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    window.localStorage.setItem("jwt", token!);
    this.token = token;
  }

  @action setAppLoaded = () => {
    runInAction(() => {
      this.appLoaded = true;
    })
  }
}