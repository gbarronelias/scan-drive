import { Injectable, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateCurrentUser
} from '@angular/fire/auth';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';
import { updateProfile } from 'firebase/auth';
import { Toast } from 'ngx-toastr';
import { OpenAIApi, Configuration } from 'openai';
import { environment } from 'src/environments/environment';
import { Database, onValue } from '@angular/fire/database';
import { ref, set } from 'firebase/database';
import { Message } from '../interface';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

@Injectable({
  providedIn: 'root',
})
export class GenApiService implements OnInit{
  uuid:string = '';
  messages!: [];
  constructor(
    private auth: Auth,
    private database: Database,
    private router: Router,
    private toast: ToastrService
    ) {      
    const user = localStorage.getItem('uuid');
    console.log('user', user);
    if(user){
      this.uuid = user;
    } }


    ngOnInit(): void {
      const user = localStorage.getItem('uuid');
      console.log('user', user);
      if(user){
        this.uuid = user;
      }
    }

  async generateChat(message: string) {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: `Que hago si mi auto ${message}` }],
      temperature: 0.2,
    });
    let data = { role: '', content: '' };
    Object.assign(data, completion.data.choices[0].message);
    return data;
  }

  register({ email, password, nombre }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((res) => {
      console.log(res)
      this.toast.success(`Bienvenido ${res.user.displayName}`);
      this.router.navigate(['/chat']);
      localStorage.setItem('uuid', res.user.uid);
      const user = this.auth.currentUser;
      if(user){
        updateProfile(user, {displayName: nombre});
        res.user.displayName ? localStorage.setItem('displayName', res.user.displayName) : '';
      }
    })
    .catch((error) => {
      console.log(error)
      alert('Usuario o contraseña incorrecto');
    });
    
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((response) => {
      this.setToast('success',`Bienvenido ${response.user.displayName}`);
      console.log('response login', response)
      localStorage.setItem('uuid', response.user.uid);
      response.user.displayName ? localStorage.setItem('displayName', response.user.displayName) : '';
      this.router.navigate(['home']);
    })
    .catch((error) => console.log(error));
  }

  setMessages (messages:Message[]){
    set(ref(this.database, this.uuid), {
      'messages': messages
    });
  }
  
  setToast(type:string ,message:string, config:any = null ){
    if(config && config.hasOwnProperty('logout')){
      this.toast.toastrConfig.positionClass = config.positionClass;

    }
    switch(type){
      case 'success':
        this.toast.success(message);
      break;
      case 'error':
        this.toast.error(message);
      break;
      case 'info':
        this.toast.info(message);
      break;
      case 'warning':
        this.toast.warning(message);
      break;
    }
  }
}
