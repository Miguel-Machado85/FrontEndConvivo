import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Rol } from 'src/app/models/usuario.model';
import { CommonModule } from '@angular/common';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Validador para confirmar contraseñas
function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirmCtrl = group.get('nPassword');

  if (!confirmCtrl) return null;
  const confirm = confirmCtrl.value;

  // ¿Hay mismatch?
  const mismatch = pass && confirm && pass !== confirm;

  // Asegura que el error viva en el control nPassword (para que <mat-error> lo muestre)
  if (mismatch) {
    const currentErrors = confirmCtrl.errors || {};
    if (!currentErrors['passwordMismatch']) {
      confirmCtrl.setErrors({ ...currentErrors, passwordMismatch: true });
    }
    return { passwordMismatch: true };
  } else {
    // Limpia solo este error si ya coincide
    if (confirmCtrl.errors?.['passwordMismatch']) {
      const { passwordMismatch, ...rest } = confirmCtrl.errors;
      confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }
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

  constructor(
    private settings: CoreService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

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
    rol: new FormControl<Rol>(Rol.Vecino, [Validators.required])
  }, { validators: passwordMatch });

  get f() { return this.form.controls; }
  get passwordMismatch() { return this.form.hasError('passwordMismatch'); }

  addUsuario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombreCompleto, email, password, rol } = this.form.getRawValue();

    const usuario: Usuario = {
      nombreCompleto: nombreCompleto!,
      correo: email!,
      password: password!,
      rol: rol!
    };

    this.usuarioService.addUsuario(usuario).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/authentication/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar el usuario');
      }
    });
  }
}
