import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';
import { Espacio } from 'src/app/models/espacio.model';
import { MaterialModule } from 'src/app/material.module';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

function alMenosUnDia(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const group = control as FormGroup;
        const alMenosUno = Object.values(group.controls).some(ctrl => ctrl.value === true);
        return alMenosUno ? null : { sinDiasSeleccionados: true };
    };
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
    selector: 'app-editar-espacio-admin',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        MatTimepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule
    ],
    templateUrl: './editarEspacioAdmin.component.html',
    styleUrls: ['./editarEspacioAdmin.component.scss']
})
export class EditarEspacioAdminComponent implements OnInit {
    espacioForm = new FormGroup({
        nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
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
        }, { validators: alMenosUnDia() })
    }, { validators: finMasTemprano() });

    diasSemana = [
        { value: 'lunes', label: 'Lunes' },
        { value: 'martes', label: 'Martes' },
        { value: 'miercoles', label: 'Miércoles' },
        { value: 'jueves', label: 'Jueves' },
        { value: 'viernes', label: 'Viernes' },
        { value: 'sabado', label: 'Sábado' },
        { value: 'domingo', label: 'Domingo' }
    ];

    espacioId: string;
    isSubmitting = false;

    constructor(
        private espacioService: EspacioService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.espacioId = this.route.snapshot.paramMap.get('id') || '';
        this.loadEspacio();

        this.espacioForm.get('horaInicio')?.valueChanges.subscribe(() => {
        this.espacioForm.updateValueAndValidity();
        });

        this.espacioForm.get('horaFin')?.valueChanges.subscribe(() => {
        this.espacioForm.updateValueAndValidity();
    });
    }

    loadEspacio() {
        this.espacioService.getEspacioById(this.espacioId).subscribe({
            next: (espacio) => {
                this.populateForm(espacio);
            },
            error: (err) => {
                console.error(err)
            }
        });
    }

    populateForm(espacio: Espacio) {
        this.espacioForm.patchValue({
            nombre: espacio.nombre,
            horaInicio: espacio.horaInicio,
            horaFin: espacio.horaFin,
            cantidadPersonas: espacio.cantidadPersonas,
            tiempoMaximo: espacio.tiempoMaximo,
            estadoEspacio: espacio.estadoEspacio === 'Activo',
        });
        // diasHabilitado
        const diasGroup = this.espacioForm.get('diasHabilitado') as FormGroup;
        if (espacio.diasHabilitados && Array.isArray(espacio.diasHabilitados)) {
            this.diasSemana.forEach(dia => {
                diasGroup.get(dia.value)?.setValue(espacio.diasHabilitados.includes(dia.value));
            });
        }

        this.espacioForm.updateValueAndValidity();
    }

    volverLista() {
        this.router.navigate(['/espacios/list']);
    }

    getDiaControl(dia: string): FormControl {
        return this.espacioForm.get('diasHabilitado')?.get(dia) as FormControl;
    }

    onSubmit() {
        if (this.espacioForm.invalid) return;
        this.isSubmitting = true;
        // Prepare payload
        const formValue = this.espacioForm.value;
        const diasHabilitadoObj = formValue.diasHabilitado as { [key: string]: boolean | null } | undefined;
        const diasHabilitados = diasHabilitadoObj
            ? this.diasSemana
                    .filter(dia => !!diasHabilitadoObj[dia.value])
                    .map(dia => dia.value)
            : [];
        const payload = {
            nombre: formValue.nombre,
            horaInicio: formValue.horaInicio,
            horaFin: formValue.horaFin,
            cantidadPersonas: formValue.cantidadPersonas,
            tiempoMaximo: formValue.tiempoMaximo,
            diasHabilitados,
            estadoEspacio: formValue.estadoEspacio ? 'Activo' : 'Inactivo',
        };

        this.espacioService.updateEspacio(this.espacioId, payload).subscribe({
            next: (res) => {
                alert("Espacio actualizado con exito")
                this.volverLista();
            },
            error: (err) => {
                console.error(err)
            }
        })
    }

    get finMasTemprano() { return this.espacioForm.hasError('finMasTemprano'); }
}
