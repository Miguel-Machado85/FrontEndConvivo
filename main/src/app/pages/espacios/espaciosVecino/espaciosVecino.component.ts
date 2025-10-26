import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Espacio } from 'src/app/models/espacio.model';
import { Router } from '@angular/router';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-espacios-vecino',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, FormsModule, MatLabel],
  templateUrl: './espaciosVecino.component.html',
  styleUrls: ['./style.scss'],
})
export class EspaciosVecinoComponent {
  selected: Date | null = null;
  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  startTime: Date | null = null;
  endTime: Date | null = null;

  constructor(private espacioService: EspacioService, private usuarioService: UsuarioService, private router: Router) { }

  conjuntoId: string;
  espacios: Espacio[] = [];
  espacioSeleccionado: Espacio;

  ngOnInit(): void {
    this.getEspaciosActivosByConjunto();
  }

  getEspaciosActivosByConjunto() {
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        this.conjuntoId = res.detalle.conjuntoId;
        this.espacioService.getEspaciosActivosByConjuntoId(this.conjuntoId).subscribe({
          next: (res) => {
            this.espacios = res;
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  seleccionarEspacio(espacioId: string): void {
    this.espacioService.getEspacioById(espacioId).subscribe({
      next: (res) => {
        this.espacioSeleccionado = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  horaStringToDate(horaStr: string): Date {
    const [hours, minutes] = horaStr.split(':').map(Number);
    const today = new Date();
    today.setHours(hours, minutes, 0, 0);
    return today;
  }

  onStartTimeChange(event: Date) {
    if (!this.espacioSeleccionado) return;

    const min = this.horaStringToDate(this.espacioSeleccionado.horaInicio);
    const max = this.horaStringToDate(this.espacioSeleccionado.horaFin);

    // Si la hora seleccionada está fuera del rango, la corregimos
    if (event < min) this.startTime = min;
    else if (event > max) this.startTime = max;
    else this.startTime = event;
  }

  onEndTimeChange(event: Date) {
    if (!this.espacioSeleccionado) return;

    const min = this.horaStringToDate(this.espacioSeleccionado.horaInicio);
    const max = this.horaStringToDate(this.espacioSeleccionado.horaFin);

    // Si la hora final está fuera del rango o antes de la inicial
    if (event < this.startTime!) this.endTime = this.startTime;
    else if (event > max) this.endTime = max;
    else this.endTime = event;
  }


}
