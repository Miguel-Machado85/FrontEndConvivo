import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { CommonModule } from '@angular/common'


@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})

export class ResetPasswordComponent {
    constructor(private router: Router, private usuarioService: UsuarioService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const token = params.get('token');
            if (token) {
                console.log(token)
            }
        });
    }

}

