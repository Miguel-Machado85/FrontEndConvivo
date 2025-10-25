import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-espacios-vecino',
  standalone: true,
  imports: [MatCardModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, FormsModule, MatLabel],
  templateUrl: './espaciosVecino.component.html',
  styleUrls: ['./style.scss'],
  // MatNativeDateModule provides the native date adapter
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspaciosVecinoComponent{
  selected: Date | null = null;
  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  startTime: Date | null = null;
  endTime: Date | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
