import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { OpenAIApi, Configuration } from 'openai';
import { environment } from 'src/environments/environment';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

@Injectable({
  providedIn: 'root',
})
export class GenApiService {
  constructor(
    private auth: Auth,
    private storage:Storage,
    private router: Router
    ) {}

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

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((res) => {
      console.log(res)
      this.router.navigate(['/chat']);
      // this.storage.setItem('uuid', res.user.);
    })
    .catch((error) => {
      console.log(error)
      alert('Usuario o contraseña incorrecto');
    });
    
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((response) => console.log('response register', response))
    .catch((error) => console.log(error));
  }
}
