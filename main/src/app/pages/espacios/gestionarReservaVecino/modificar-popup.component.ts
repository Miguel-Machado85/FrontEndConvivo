import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modificar-popup',
  templateUrl: './modificar-popup.component.html',
  styleUrls: ['./modificar-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ModificarPopupComponent implements OnChanges {
  @Input() reserva: { espacio: string; fecha: string; hora: string } | null = null;
  @Output() closePopup = new EventEmitter<void>();
  @Output() confirmModificar = new EventEmitter<{ espacio: string; fecha: string; hora: string }>();

  modificarForm: FormGroup;

  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  mensajeErrorDia: string = '';

  constructor(private fb: FormBuilder) {
    this.modificarForm = this.fb.group({
      espacio: ['', Validators.required],
      fecha: [null, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reserva'] && this.reserva) {
      // Parse the existing reservation data
      const fecha = this.reserva.fecha ? new Date(this.reserva.fecha) : null;
      const horaInicio = this.reserva.hora || '';

      this.modificarForm.patchValue({
        espacio: this.reserva.espacio,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaInicio // Default end time same as start for modification
      });
    }
  }

  /** Cuando el usuario selecciona una fecha */
  onFechaSeleccionada(date: Date | null): void {
    this.mensajeErrorDia = ''; // Clear any previous error
    this.modificarForm.get('fecha')?.setValue(date);
  }

  horaStringToDate(hora: string | Date): Date {
    if (hora instanceof Date) {
      return hora;
    }

    const [hours, minutes] = hora.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /** Convierte objeto Date a string HH:mm */
  private formatHora(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  close() {
    this.closePopup.emit();
  }

  modificarReserva() {
    if (this.modificarForm.valid) {
      const formValue = this.modificarForm.value;
      const fecha = formValue.fecha;
      const horaInicio = formValue.horaInicio;

      const modifiedReserva = {
        espacio: formValue.espacio,
        fecha: fecha ? fecha.toISOString().split('T')[0] : '',
        hora: this.formatHora(this.horaStringToDate(horaInicio))
      };

      this.confirmModificar.emit(modifiedReserva);
    }
  }
}