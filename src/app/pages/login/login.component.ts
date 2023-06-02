import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenApiService } from 'src/app/services/gen-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  constructor(
    private apiService: GenApiService,
    private router: Router) {}
  ngOnInit(): void {}

  login() {
    if(!this.isEmpty(this.email)){
      return;
    }
    if(!this.isEmpty(this.password)){
      return;
    }

    this.apiService
      .login({ email: this.email, password: this.password });
  }

  validate(){
    
  }

  isEmpty(value:string){
    return(value && value !== '' && value !== null || undefined)
      ? true : alert('Ingresa los campos solicitados');
  }
}
