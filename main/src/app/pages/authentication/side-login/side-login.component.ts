import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthenticationService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
  const { email, password } = this.form.value;

  this.authService.authenticate(email || '', password || '').subscribe({
    next: (res) => {
      localStorage.setItem("AuthToken", res.token);
      localStorage.setItem("id", res.id);
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Error al iniciar sesión:', err);

      if (err.status === 404) {
        alert('El correo ingresado no está registrado.');
      } else if (err.status === 401) {
        alert('Contraseña incorrecta.');
      } else if (err.status === 500) {
        alert('Error del servidor. Intenta más tarde.');
      } else {
        alert('Ocurrió un error inesperado.');
      }
    }
  });
}

}
