import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { AuthenticationService } from 'src/app/services/Auth/auth.service';


@Component({
  selector: 'app-confirm',
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
    token: string | null = null;
    tokenValido: boolean = false;

    constructor(private router: Router, private route: ActivatedRoute, private reservaService: ReservaService, private authService: AuthenticationService){ }

    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
            this.token = params.get('token');

            if(!this.token){
                alert("Enlace invalido o incompleto");
                this.router.navigate(['/authentication/login']);
                return;
            }

            this.authService.validarToken(this.token).subscribe({
                next: ()=>{
                    this.tokenValido = true;
                    this.reservaService.activateReserva(this.token!).subscribe({
                      next: ()=>{
                        console.log("Reserva activada")
                      },
                      error: (err)=>{
                        console.log(err)
                      }
                    })
                },
                error: (err)=>{
                    this.tokenValido = false;
                    alert("Su sesion expiro, vuelva a pedir un correo");
                    this.router.navigate(['/authentication/login']);
                }
            });
        });
    }
}
