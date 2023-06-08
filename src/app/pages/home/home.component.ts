import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GenApiService } from 'src/app/services/gen-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  loginText :string = 'Iniciar Sesión';
constructor(private api:GenApiService, private router:Router){}

  ngOnInit(): void {
    const user = localStorage.getItem('displayName')
    if(user){
      this.loginText = user;
      this.api.setToast('success', `Bienvenido ${this.loginText}`);
    }
  }

  navigate(navigate:string){
    if(navigate.includes('login') && localStorage.getItem('displayName')){
      this.api.setToast('warning', `Si quieres cerrar sesión da click de nuevo`, {logout:true, positionClass: 'toast-center-center'})
      return;
    }
    this.router.navigate([navigate]);
  }

}
