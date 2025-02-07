import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: false,
  
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

  string = ''

  input(event: any){
    this.string = event.target.value
  }

  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
    return weekNumber;
  }

}
