import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private api_url = 'http://localhost:3000/auth';  // URL de la API

    constructor(private http: HttpClient) { }

    // Método para autenticar al usuario
    authenticate(email: string, password: string): Observable<any> {
        const endpoint = `${this.api_url}/login`;  // Endpoint para la autenticación
        const body = { correo: email, password };  // Datos a enviar en la solicitud
        return this.http.post(endpoint, body);  // Realiza la solicitud POST al servidor
    }
}