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
import { Database, onValue, push } from '@angular/fire/database';
import { ref, set } from 'firebase/database';
import { Message, MessageData } from '../interface';

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
  dataMessages:MessageData[] = [];

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
    if(!message.includes('auto' || 'carro' || 'vehiculo')){
      message = message + ' mi auto';
    }
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: `${message}` }],
      temperature: 1,
    });
    let data = { role: '', content: '' };
    Object.assign(data, completion.data.choices[0].message);
    return data;
  }

  register({ email, password, nombre }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((res) => {
      console.log(res)
      debugger
      const user = this.auth.currentUser;
      if(user){
        this.uuid = res.user.uid;
        updateProfile(user, {displayName: nombre}).then(()=>{          
          this.uuid = res.user.uid;
          localStorage.setItem('uuid', res.user.uid);
          this.router.navigate(['/home']);
          res.user.displayName ? localStorage.setItem('displayName', res.user.displayName) : '';
          this.toast.success(`Bienvenido ${res.user.displayName}`);
        });
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
      //this.setToast('success',`Bienvenido ${response.user.displayName}`);
      localStorage.setItem('uuid', response.user.uid);
      this.uuid = response.user.uid;
      response.user.displayName ? localStorage.setItem('displayName', response.user.displayName) : '';
      this.router.navigate(['home']);
    })
    .catch((error) => console.log(error));
  }

  setMessage (message:Message[], index:any = null, isNew:any = false){
    if(isNew){
      push(ref(this.database, this.uuid), {message});
    }
    if(index !== null)
    set(ref(this.database, this.uuid+'/'+index), {message});
  }

  getMessages(){
    const startConfig = ref(this.database, this.uuid+'/');
    onValue(startConfig, (snapshot)=>{
      if(snapshot.val()?.length > 0 && snapshot.val() && this.dataMessages.length != 0){
        console.log('entro')
        // this.dataMessages = snapshot.val();
      }else{

      }
    });
  }
  
  logout(){
    const toast = this.toast.warning(`Si quieres cerrar sesión da click de nuevo`);
    toast.onTap.subscribe(acction=>{
      this.auth.signOut().then(()=>{
        localStorage.setItem('uuid', '');
        localStorage.setItem('displayName', '');
        this.uuid = '';
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/home']));
        this.toast.success('Sessión cerrada con exito');
      })
    });
  }
  setToast(type:string ,message:string, config:any = null ){
    if(config && config?.logout){
      this.toast.toastrConfig.positionClass = config.positionClass;
      this.logout();
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

  getDate(){
    return {
      day: new Date().getDate(),
      month: new Date().getMonth()+1,
      year: new Date().getFullYear(),
      fullDate: new Date().getDate() + "-" +( new Date().getMonth()+1) + "-" + new Date().getFullYear()
    }
  }
}
