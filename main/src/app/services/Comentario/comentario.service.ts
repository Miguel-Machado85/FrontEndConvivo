import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from 'src/app/models/comentario.model';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private api_url = 'http://localhost:3000/comentario'

  constructor(private http: HttpClient) { }

  addComentario(comentario: Comentario): Observable<any> {
    const endpoint = `${this.api_url}/create`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.post(endpoint, comentario, {headers});
  }

  getComentario(id: string): Observable<Comentario> {
    const endpoint = `${this.api_url}/get/${id}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario>(endpoint, { headers });
  }

  getComentarios(): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/get`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario[]>(endpoint, {headers});
  }

  getComentariosByUsuarioId(usuarioId: string): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/getU/${usuarioId}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario[]>(endpoint, { headers });
  }

  getComentariosLigadosByUsuarioID(usuarioId: string): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/getL/${usuarioId}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario[]>(endpoint, { headers });
  }
  
  getAnunciosByConjuntoId(conjuntoId: string): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/getA/${conjuntoId}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario[]>(endpoint, { headers }); 
  }

  deleteComentario(id: string): Observable<any> {
    const endpoint = `${this.api_url}/delete/${id}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.delete(endpoint, { headers });
  }
}
