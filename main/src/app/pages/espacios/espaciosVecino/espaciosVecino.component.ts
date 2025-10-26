import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { Espacio } from 'src/app/models/espacio.model';

function toMinutes(h: string | Date | null | undefined): number | null {
  if (h == null) return null;

  if (h instanceof Date) {
    return h.getHours() * 60 + h.getMinutes();
  }

  if (typeof h === 'number') {
    return Math.floor(h);
  }

  if (typeof h === 'string') {
    // Si es "HH:mm"
    if (/^\d{1,2}:\d{2}$/.test(h)) {
      const [hh, mm] = h.split(':').map(Number);
      if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
        return hh * 60 + mm;
      }
    }

    const d = new Date(h);
    if (!isNaN(d.getTime())) {
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  return null;
}

export function validarHoras(espacio: Espacio): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const inicio = group.get('horaInicio')?.value;
    const fin = group.get('horaFin')?.value;

    if (!inicio || !fin || !espacio) return null;

    const inicioMin = toMinutes(inicio);
    const finMin = toMinutes(fin);
    const aperturaMin = toMinutes(espacio.horaInicio);
    const cierreMin = toMinutes(espacio.horaFin);

    if (inicioMin == null || finMin == null || aperturaMin == null || cierreMin == null) {
      return null;
    }

    if (inicioMin >= finMin) return { finMasTemprano: true };
    if (inicioMin < aperturaMin) return { inicioAntesDeApertura: true };
    if (finMin > cierreMin) return { finDespuesDeCierre: true };

    return null;
  };
}

@Component({
  selector: 'app-espacios-vecino',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './espaciosVecino.component.html',
  styleUrls: ['./style.scss'],
})
export class EspaciosVecinoComponent implements OnInit {
  conjuntoId!: string;
  espacios: Espacio[] = [];
  espacioSeleccionado!: Espacio;

  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  reservaForm = new FormGroup<{
  fecha: FormControl<Date | null>;
  horaInicio: FormControl<string | null>;
  horaFin: FormControl<string | null>;
  cantidadPersonas: FormControl<number | null>;
}>({
  fecha: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  horaInicio: new FormControl<string>('', { validators: [Validators.required] }),
  horaFin: new FormControl<string>('', { validators: [Validators.required] }),
  cantidadPersonas: new FormControl<number>(1, { validators: [Validators.required, Validators.min(1)] }),
});


  constructor(
    private usuarioService: UsuarioService,
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    private router: Router
  ) { }

  //COSITA DE CALENDARIO

  mensajeErrorDia: string = '';

/** Determina si un día del calendario está habilitado según el espacio seleccionado */
esDiaHabilitado = (date: Date | null): boolean => {
  if (!date || !this.espacioSeleccionado) return true; // Si no hay espacio seleccionado, permitir todos

  const diasHabilitados = (this.espacioSeleccionado.diasHabilitados || []).map((d: string) =>
    d.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );

  // Convertir número de día a nombre
  const nombresDias = [
    'domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'
  ];
  const nombreDia = nombresDias[date.getDay()];

  // Validar si el día está dentro de los habilitados
  return diasHabilitados.includes(nombreDia);
};

/** Cuando el usuario selecciona una fecha */
onFechaSeleccionada(date: Date | null): void {
  if (!this.esDiaHabilitado(date)) {
    this.mensajeErrorDia = 'Este día no está disponible para reservar este espacio.';
    this.reservaForm.get('fecha')?.setValue(null);
  } else {
    this.mensajeErrorDia = '';
    this.reservaForm.get('fecha')?.setValue(date);
  }
}


//COSITA DE CALENDARIO


  ngOnInit(): void {
    this.getEspaciosActivosByConjunto();
  }

  getEspaciosActivosByConjunto() {
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        this.conjuntoId = res.detalle.conjuntoId;
        this.espacioService
          .getEspaciosActivosByConjuntoId(this.conjuntoId)
          .subscribe({
            next: (res) => {
              this.espacios = res;
            },
            error: (err) => console.log(err),
          });
      },
      error: (err) => console.log(err),
    });
  }

  seleccionarEspacio(espacioId: string): void {
    this.espacioService.getEspacioById(espacioId).subscribe({
      next: (res) => {
        this.reservaForm.reset()
        this.espacioSeleccionado = res;
        console.log('Espacio seleccionado:', res);

        this.reservaForm.setValidators(validarHoras(this.espacioSeleccionado));
        this.reservaForm.updateValueAndValidity();
      },
      error: (err) => console.log(err),
    });
  }

  horaStringToDate(horaStr: string): Date {
    const [hours, minutes] = horaStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  crearReserva() {
    // if (!this.espacioSeleccionado || !this.reservaForm.valid) {
    //   alert('Por favor, completa todos los campos correctamente.');
    //   return;
    // }

    // const usuarioId = localStorage.getItem('id')!;
    // const { fecha, horaInicio, horaFin, cantidadPersonas } = this.reservaForm.value;

    // if (cantidadPersonas > this.espacioSeleccionado.cantidadPersonas) {
    //   alert(
    //     `Este espacio permite máximo ${this.espacioSeleccionado.cantidadPersonas} personas.`
    //   );
    //   return;
    // }

    // const reservaData = {
    //   usuarioId,
    //   espacioId: this.espacioSeleccionado.id!,
    //   fecha: fecha.toISOString().split('T')[0],
    //   horaInicio: this.formatHora(horaInicio),
    //   horaFin: this.formatHora(horaFin),
    //   cantidadPersonas,
    //   estado: 'Activo',
    // };

    // this.reservaService.createReserva(reservaData).subscribe({
    //   next: (res) => {
    //     alert('Reserva creada con éxito 🎉');
    //     this.router.navigate(['/menu/vecino']);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     alert('Ocurrió un error al crear la reserva.');
    //   },
    // });
  }

  /** Convierte objeto Date a string HH:mm */
  private formatHora(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  cancelarReserva(): void {
    this.router.navigate(['/menu/vecino']);
  }

  get f() { return this.reservaForm.controls; }
}
