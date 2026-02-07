import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Reserva } from 'src/app/models/reserva.model';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { Espacio } from 'src/app/models/espacio.model';

function toMinutes(h: string | Date | null | undefined): number | null {
  if (h == null) return null;

  if (h instanceof Date) {
    return h.getHours() * 60 + h.getMinutes();
  }

  if (typeof h === 'string') {
    if (/^\d{1,2}:\d{2}$/.test(h)) {
      const [hh, mm] = h.split(':').map(Number);
      if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
        return hh * 60 + mm;
      }
    }
  }
  return null;
}

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
export class ModificarPopupComponent implements OnInit, OnChanges {
  @Input() reserva: Reserva | null = null;
  @Output() closePopup = new EventEmitter<void>();
  @Output() confirmModificar = new EventEmitter<Partial<Reserva>>();

  modificarForm!: FormGroup;
  espacioSeleccionado: Espacio | null = null;

  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  mensajeErrorDia: string = '';

  constructor(
    private fb: FormBuilder,
    private espacioService: EspacioService
  ) {}

  ngOnInit(): void {
    this.modificarForm = this.fb.group({
      fecha: [null, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      cantidadPersonas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reserva'] && this.reserva) {
      this.loadReservaData();
    }
  }

  private loadReservaData(): void {
    if (!this.reserva?.espacioId) return;

    // Cargar espacio para validaciones
    this.espacioService.getEspacioById(this.reserva.espacioId).subscribe({
      next: (espacio) => {
        this.espacioSeleccionado = espacio;
        this.setupFormValidators();

        // Cargar datos existentes de la reserva
        const fecha = this.reserva!.fecha ? this.parseFechaLocal(this.reserva!.fecha) : null;
        
        this.modificarForm.patchValue({
          fecha: fecha,
          horaInicio: this.reserva!.horaInicio || '',
          horaFin: this.reserva!.horaFin || '',
          cantidadPersonas: this.reserva!.cantidadPersonas || 1
        });
      },
      error: (err) => {
        console.error('Error cargando espacio para validaciones:', err);
      }
    });
  }

  private parseFechaLocal(fechaString: string): Date {
    const [year, month, day] = fechaString.split('-').map(Number);
    return new Date(year, month - 1, day); // Sin horas = sin timezone shift
}

  private setupFormValidators(): void {
    if (!this.espacioSeleccionado) return;

    // Validator para horas del espacio
    this.modificarForm.setValidators(this.validarHoras(this.espacioSeleccionado));
    
    // Validator para cantidad de personas
    this.modificarForm.get('cantidadPersonas')?.setValidators([
      Validators.required,
      Validators.min(1),
      (control) => {
        const cupo = control.value;
        if (!cupo || !this.espacioSeleccionado) return null;
        return cupo > this.espacioSeleccionado.cantidadPersonas
          ? { sobreCupo: true }
          : null;
      }
    ]);
    
    this.modificarForm.updateValueAndValidity();
  }

  validarHoras(espacio: Espacio): ValidatorFn {
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

      const duracion = finMin - inicioMin;
      const tiempoMaximoMin = espacio.tiempoMaximo * 60;
      if (duracion > tiempoMaximoMin) return { excedeTiempoMaximo: true };

      return null;
    };
  }

  /** Determina si un día del calendario está habilitado */
  esDiaHabilitado = (date: Date | null): boolean => {
    if (!date || !this.espacioSeleccionado) return true;

    const diasHabilitados = (this.espacioSeleccionado.diasHabilitados || []).map((d: string) =>
      d.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    const nombresDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const nombreDia = nombresDias[date.getDay()];

    return diasHabilitados.includes(nombreDia);
  };

  onFechaSeleccionada(date: Date | null): void {
    if (!this.esDiaHabilitado(date)) {
      this.mensajeErrorDia = 'Este día no está disponible para reservar este espacio.';
      this.modificarForm.get('fecha')?.setValue(null);
    } else {
      this.mensajeErrorDia = '';
      this.modificarForm.get('fecha')?.setValue(date);
    }
  }

  horaStringToDate(hora: string | Date): Date {
    if (hora instanceof Date) return hora;
    const [hours, minutes] = hora.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatHora(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  close() {
    this.closePopup.emit();
  }

  modificarReserva() {
    if (this.modificarForm.invalid || !this.espacioSeleccionado) {
      this.modificarForm.markAllAsTouched();
      return;
    }

    const formValue = this.modificarForm.value;
    const reservaData: Partial<Reserva> = {
      id: this.reserva!.id,
      fecha: formValue.fecha!.toISOString().split('T')[0],
      horaInicio: this.formatHora(this.horaStringToDate(formValue.horaInicio!)),
      horaFin: this.formatHora(this.horaStringToDate(formValue.horaFin!)),
      cantidadPersonas: formValue.cantidadPersonas!
    };

    this.confirmModificar.emit(reservaData);
  }

  get f() { return this.modificarForm.controls; }
}
