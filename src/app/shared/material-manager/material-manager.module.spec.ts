import { MaterialManagerModule } from './material-manager.module';

describe('MaterialManagerModule', () => {
  let materialManagerModule: MaterialManagerModule;

  beforeEach(() => {
    materialManagerModule = new MaterialManagerModule();
  });

  it('should create an instance', () => {
    expect(materialManagerModule).toBeTruthy();
  });
});
