import { observable } from 'mobx';

class LoadingStore {
  @observable enabled;
}

const loadingStore = new LoadingStore();
export default loadingStore;
