import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { ConjuntoService } from 'src/app/services/Conjunto/conjunto.service';
import { Rol } from 'src/app/models/usuario.model';
import { CommonModule } from '@angular/common';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsuarioRequest } from 'src/app/models/usuarioRequest.model';
import { Conjunto } from 'src/app/models/conjunto.model';

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
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',

})
export class AppSideRegisterComponent {
  Rol = Rol;
  roles: Rol[] = [Rol.Vecino, Rol.Administrador];
  listaConjuntos: Conjunto[] = [];

  constructor(
    private settings: CoreService,
    private router: Router,
    private usuarioService: UsuarioService,
    private conjuntoService: ConjuntoService
  ) { }

  ngOnInit(){
    this.getConjuntos();
  }

  form = new FormGroup({
    nombreCompleto: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]), // Opción 1: solo formato
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(PASSWORD_REGEX)
    ]),
    nPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(PASSWORD_REGEX) // mismas reglas que password
    ]),
    numeroApartamento: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    conjunto: new FormControl<string | null>(null, [Validators.required])
  }, { validators: passwordMatch });

  get f() { return this.form.controls; }
  get passwordMismatch() { return this.form.hasError('passwordMismatch'); }
  get noPassError() { return this.form.hasError('noPassError') }

  addUsuario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombreCompleto, email, password, numeroApartamento, conjunto } = this.form.value;

    const usuario: UsuarioRequest = {
      nombreCompleto: nombreCompleto!,
      correo: email!,
      password: password!,
      rol: Rol.Vecino,
      conjuntoId: conjunto!,
      numeroApartamento: numeroApartamento!,
    };

    this.usuarioService.addUsuario(usuario).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/authentication/login']);
      },
      error: (err) => {
        console.log(err);

        if (err.status === 400) {
          alert('El correo ingresado ya esta registrado.');
        } else {
          alert('Error al registrar el usuario');
        }
      }
    });
  }

  getConjuntos(){
    this.conjuntoService.getConjuntos().subscribe({
      next: (res) =>{
        this.listaConjuntos = res;
      },
      error: (err) =>{
        console.error(err);
        
      }
    })
  }
}
