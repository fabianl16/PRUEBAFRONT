import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createUserDto, IUser } from '../form/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor( private httpClient: HttpClient) { }
  create(user:createUserDto):Observable<IUser>{
    return this.httpClient.post<IUser>(environment.hostUrl+'user/create', user);
  }
}
