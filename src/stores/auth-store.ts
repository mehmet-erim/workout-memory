import { observable } from "mobx";

class AuthStore {
  @observable currentUserUid;
}

const authStore = new AuthStore();
export default authStore;
