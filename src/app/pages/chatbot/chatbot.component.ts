import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/interface';
import { Observable } from 'rxjs';
import { GenApiService } from 'src/app/services/gen-api.service';
import { OpenAIApi, Configuration } from 'openai';

  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {
  data : Message[] = [];
  userMessage:string = '';
  isClickeable:boolean = true;
  myScrollVariable:number = 9999;
  @ViewChild('chatContainer') divChat!: ElementRef;
  // response:Observable<any>= new Observable;
  constructor(private api:GenApiService){}
  ngOnInit(){
    this.setMessage({role:"assistant", content:"Hola Bienvenido a la IA Scan Drive"});
    // this.scrollDiv();
  }
  sendMessage(message:string){
    this.userMessage = '';
    this.setMessage({role:"user", content:message});
    this.scrollDiv();
    this.generateChat(message);
  }
  async generateChat(message:string){
    let data = {role:"", content:""};
    this.isClickeable = false;
    Object.assign(data, await this.api.generateChat(message));
    this.setMessage(data);
    if(data){
      this.scrollDiv();
      this.isClickeable = true;
    }
    // this.data.push(...[{role:data.role, message:data.content}]);
    console.log(this.data)
  }


  setMessage(data:{role:string, content:string}){
    this.data.push(...[{role:data.role, message:data.content}]);
  }

  scrollDiv(){
    setTimeout(()=>{
      this.divChat.nativeElement.scrollTop = 9999;
    }, 100)
  }



}
