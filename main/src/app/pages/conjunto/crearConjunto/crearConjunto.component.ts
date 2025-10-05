import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ConjuntoService } from 'src/app/services/Conjunto/conjunto.service';
import { Conjunto } from 'src/app/models/conjunto.model';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { UsuarioRequest } from 'src/app/models/usuarioRequest.model';
import { Rol } from 'src/app/models/usuario.model';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('nPassword')?.value;

  // Si ambos existen y no coinciden, devolver error
  if (pass && confirm && pass !== confirm) {
    return { passwordMismatch: true };
  }

  if (confirm && !pass) {
    return { noPassError: true }
  }

  // Si coinciden (o están vacíos), no hay error
  return null;
}

@Component({
  selector: 'app-crear-conjunto',
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crearConjunto.component.html',
  styleUrls: ['./style.scss']
})
export class CrearConjuntoComponent {

  form = new FormGroup({
    nombreConjunto: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    ciudad: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    numeroApartamentos: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    nombreCompleto: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)] }),
    nPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(PASSWORD_REGEX)]}),
    telefono: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // patrón básico internacional o nacional; ajusta según tu necesidad
        Validators.pattern(/^[0-9+\-\s()]{7,20}$/)
      ]
    })
  }, {validators: passwordMatch});

  constructor(
    private router: Router,
    private conjuntoService: ConjuntoService,
    private usuarioService: UsuarioService
  ) {}

  get f() { return this.form.controls; }
  get passwordMismatch() { return this.form.hasError('passwordMismatch'); }
  get noPassError() { return this.form.hasError('noPassError') }

  addConjunto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      nombreConjunto,
      ciudad,
      direccion,
      numeroApartamentos,
      nombreCompleto,
      email,
      password,
      telefono
    } = this.form.value;

    const conjunto: Conjunto = {
      nombreConjunto: nombreConjunto!,
      ciudad: ciudad!,
      direccion: direccion!,
      numeroApartamentos: numeroApartamentos!
    };

    this.conjuntoService.createConjunto(conjunto).subscribe({
      next: (res) => {
        alert('Conjunto registrado correctamente');
        const conjuntoId = res.id;

        const admin: UsuarioRequest = {
          nombreCompleto: nombreCompleto!,
          correo: email!,
          password: password!,
          rol: Rol.Administrador,
          conjuntoId: conjuntoId,
          telefono: telefono!
        }

        this.usuarioService.addUsuario(admin).subscribe({
          next: (res) =>{
            alert("Administrador registrado correctamente");
            this.router.navigate(['/']);
          },
          error: (err) =>{
            alert("El admin no pudo ser creado");
            console.error(err);
            
          }
        })
      },
      error: (err) => {
        alert("El conjunto no pudo ser creado");
        console.error(err);
      }
    });
  }
}