import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { AuthenticationService } from 'src/app/services/Auth/auth.service';
import { CommonModule } from '@angular/common'
import { Token } from '@angular/compiler';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('nPassword')?.value;

  // Si ambos existen y no coinciden, devolver error
  if (pass && confirm && pass !== confirm) {
    return { passwordMismatch: true };
  }

  if(confirm && !pass){
    return { noPassError: true }
  }

  // Si coinciden (o están vacíos), no hay error
  return null;
}

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})

export class ResetPasswordComponent {
    token: string | null = null;
    tokenValido: boolean = false;
    form!: FormGroup;

    constructor(private router: Router, private usuarioService: UsuarioService, private authService: AuthenticationService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.token = params.get('token');

            if(!this.token){
                alert("Enlace invalido o incompleto");
                this.router.navigate(['/authentication/forgot']);
                return;
            }

            this.authService.validarToken(this.token).subscribe({
                next: ()=>{
                    this.tokenValido = true;
                    this.crearFormulario();
                },
                error: (err)=>{
                    this.tokenValido = false;
                    alert("Su sesion expiro, vuelva a pedir un correo");
                    this.router.navigate(['/authentication/forgot']);
                }
            });
        });
    }

    crearFormulario(): void{
        this.form = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
            nPassword: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)])
        }, { validators: passwordMatch})
    }

    get passwordMismatch() { return this.form.hasError('passwordMismatch'); }

    submit(){
        this.usuarioService.changePassword(this.token || '', this.form.get('password')?.value).subscribe({
            next: () =>{
                alert('Contraseña actualizada exitosamente')
                this.router.navigate(['/authentication/login']);
            },
            error: (err) =>{
                console.log(err);
                alert("hubo un error modificando la contraseña")
            }
        })
    }

}