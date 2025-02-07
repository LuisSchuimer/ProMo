import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponent } from './test.component';
import { By } from '@angular/platform-browser';

describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows input', () => {
    const {debugElement} = fixture;
    var input = debugElement.query(By.css('#input')).nativeElement
    var display = debugElement.query(By.css('#display')).nativeElement

    input.value = "Test"
    input.dispatchEvent(new Event("input"))

    fixture.detectChanges()

    expect(component.string).toBe("Test")
    expect(display.value).toBe("Test")
  });

  it('calculates correct week-number', () => {
    expect(component.getWeekNumber(new Date("2025/02/10"))).toBe(7)
  })
});
