import { Component } from '@angular/core';
import { GenApiService } from 'src/app/services/gen-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: string = '';
  password: string = '';

  constructor(private api: GenApiService) {}

  register() {
    this.api
      .register({ email: this.user, password: this.password });
  }
}
