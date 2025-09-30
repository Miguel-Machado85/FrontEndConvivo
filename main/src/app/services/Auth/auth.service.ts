import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private api_url = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) { }

    authenticate(email: string, password: string): Observable<any> {
        const endpoint = `${this.api_url}/login`;  
        const body = { correo: email, password };  
        return this.http.post(endpoint, body);
    }

    sendResetEmail(email: string): Observable<any> {
        const endpoint=`${this.api_url}/reset-password`; 
        const body= {correo: email}
        return this.http.post(endpoint,body)

    }
}