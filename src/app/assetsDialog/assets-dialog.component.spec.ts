import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AssetsDialog } from './assets-dialog.component';

describe('AssetsDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AssetsDialog],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AssetsDialog);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AssetsDialog);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain(
      'cyprus-codes app is running!'
    );
  });
});
