import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-crear-espacio',
  imports: [RouterModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crearEspacio.component.html',
  styleUrls: ['./style.scss']
})
export class CrearEspacioComponent implements OnInit {

  espacioForm = new FormGroup({
  });

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

  constructor() { }

  ngOnInit(): void {
  }

  isDiaSelected(dia: string): boolean {
    return false;
  }

  onDiaChange(dia: string, checked: boolean): void {
  }
}