import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Espacio } from 'src/app/models/espacio.model';

export function alMenosUnDia(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;

    const alMenosUno = Object.values(group.controls).some(ctrl => ctrl.value === true);

    return alMenosUno? null: {sinDiasSeleccionados: true};
  }
}

export function finMasTemprano(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup
    const inicio = control.get('horaInicio')?.value;
    const fin = control.get('horaFin')?.value;

    if(!inicio || !fin){
      return null;
    }

    const [hiHoras, hiMinutos] = inicio.split(':').map(Number);
    const [hfHoras, hfMinutos] = fin.split(':').map(Number);
    const inicioEnMin = hiHoras * 60 + hiMinutos;
    const finEnMin = hfHoras * 60 + hfMinutos;

    return inicioEnMin < finEnMin? null : {finMasTemprano: true};
  };
}

@Component({
  selector: 'app-crear-espacio',
  imports: [RouterModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crearEspacio.component.html',
  styleUrls: ['./style.scss']
})
export class CrearEspacioComponent implements OnInit {

  conjuntoId: string;

  espacioForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required]),
    cantidadPersonas: new FormControl(1, [Validators.required, Validators.min(1)]),
    tiempoMaximo: new FormControl(1, [Validators.required, Validators.min(1)]),
    estadoEspacio: new FormControl(true),
    diasHabilitado: new FormGroup({
      lunes: new FormControl(false),
      martes: new FormControl(false),
      miercoles: new FormControl(false),
      jueves: new FormControl(false),
      viernes: new FormControl(false),
      sabado: new FormControl(false),
      domingo: new FormControl(false),
    }, {validators: alMenosUnDia()})
  }, {validators: finMasTemprano()});

  diasSemana = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  isSubmitting = false;

  constructor(private espacioService: EspacioService, private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.getConjuntoId();
  }

  getConjuntoId() {
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res) => {
        console.log(res);

        this.conjuntoId = res.detalle.conjuntoId;

        console.log(res.detalle.conjuntoId);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  isDiaSelected(dia: string): boolean {
    return this.espacioForm.get('diasHabilitado')?.get(dia)?.value || false;
  }

  onDiaChange(dia: string, checked: boolean): void {
    const control = this.espacioForm.get('diasHabilitado')?.get(dia);
    if (control) control.setValue(checked);
  }

  addConjunto() {
    if (this.espacioForm.invalid) {
      this.espacioForm.markAllAsTouched();
      return;
    }

    const { nombre,
      descripcion,
      horaInicio,
      horaFin,
      cantidadPersonas,
      tiempoMaximo,
      estadoEspacio,
      diasHabilitado
    } = this.espacioForm.value;

    const diasHabilitadoValue = this.espacioForm.get('diasHabilitado')?.value || {};
    const diasSeleccionados = Object.keys(diasHabilitadoValue)
      .filter(dia => (diasHabilitadoValue as Record<string, boolean>)[dia] === true);

    const espacio: Espacio = {
      nombre: nombre!,
      descripcion: descripcion!,
      conjuntoId: this.conjuntoId,
      horaInicio: horaInicio!,
      horaFin: horaFin!,
      diasHabilitados: diasSeleccionados,
      cantidadPersonas: cantidadPersonas!,
      tiempoMaximo: tiempoMaximo!,
      estadoEspacio: estadoEspacio ? 'Activo' : 'Inactivo'
    }

    this.espacioService.createEspacio(espacio).subscribe({
      next: (res) => {
        alert("Espacio común creado exitosamente");
        this.router.navigate(['/espacios/list']);
      },
      error: (err) => {
        console.log(err);
        alert("El espacio no pudo ser creado");

      }
    })
  }

  get f() { return this.espacioForm.controls; }
  get sinDiasSeleccionados() { return this.espacioForm.hasError('sinDiasSeleccionados'); }
  get finMasTemprano() { return this.espacioForm.hasError('finMasTemprano'); }

  volverLista(){
    this.router.navigate(['/espacios/list']);
  }
}