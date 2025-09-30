import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/Auth/auth.service';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.component.html',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class ForgotPasswordComponent {
    constructor(private router: Router, private authService: AuthenticationService) { }

    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    submit() {
        const { email } = this.form.value

        this.authService.sendResetEmail(email || '').subscribe({
            next: (res) => {
                alert("En breve te llegara un correo que te indicara el paso a paso")
            },
            error: (err) => {
                console.error('Error al enviar correo:', err);
                if (err.status === 404) {
                    alert('El correo ingresado no está registrado.');
                }else {
                    alert('No se pudo enviar el correo')
                }
            }

        })

    }
}


