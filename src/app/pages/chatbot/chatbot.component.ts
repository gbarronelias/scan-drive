import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/interface';
import { Observable } from 'rxjs';
import { GenApiService } from 'src/app/services/gen-api.service';
import { OpenAIApi, Configuration } from 'openai';
import { ref } from 'firebase/database';
import { Database, onValue } from '@angular/fire/database';

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

  data: Message[] = [];
  userMessage: string = '';
  isClickeable: boolean = true;
  showLoadData: boolean = false;
  @ViewChild('chatContainer') divChat!: ElementRef;

  constructor(
    private api: GenApiService,
    private database:Database) { }

  ngOnInit() {
    
    const data = this.getMessages();
    console.log(data);
    // this.setMessage({ role: "assistant", content: "Hola Bienvenido a la IA Scan Drive" });
  }

  getMessages(){
    this.showLoadData = true;
    const startConfig = ref(this.database, this.api.uuid);
    onValue(startConfig, (snapshot)=>{
      console.log('snapshot', snapshot.val().messages)
      this.data = snapshot.val().messages;
      this.showLoadData=false;
    });
  }

  sendMessage(message: string) {
    this.userMessage = '';
    if(message !== ''){
      this.setMessage({ role: "user", content: message });
      this.scrollDiv();
      this.generateChat(message);
    }else{
      alert('Introduce un dato valido');
    }
  }

  async generateChat(message: string) {
    let data = { role: "", content: "" };
    this.isClickeable = false;
    setTimeout(() => {
      this.showLoadData = true;
    }, 100)
    Object.assign(data, await this.api.generateChat(message));
    this.setMessage(data);
    if (data) {
      this.showLoadData = false;
      this.scrollDiv();
      this.isClickeable = true;
    }
    // this.data.push(...[{role:data.role, message:data.content}]);
    console.log(this.data)
  }


  setMessage(data: { role: string, content: string }) {
    this.data.push(...[{ role: data.role, message: data.content }]);
    this.api.setMessages(this.data);
  }

  scrollDiv() {
    setTimeout(() => {
      this.divChat.nativeElement.scrollTop = 9999;
    }, 100)
  }

}
