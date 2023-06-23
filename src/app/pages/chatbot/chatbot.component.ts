import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/interface';
import { GenApiService } from 'src/app/services/gen-api.service';
import { OpenAIApi, Configuration } from 'openai';
import { ref } from 'firebase/database';
import { Database, onValue, push } from '@angular/fire/database';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {

  messages: Message[] = [];
  listMessages!:any[];
  userMessage: string = '';
  isClickeable: boolean = true;
  showLoadData: boolean = false;
  indexMessage: any = null;
  listChatDisable: any = false;
  tutorial!:boolean;
  @ViewChild('chatContainer') divChat!: ElementRef;

  constructor(
    private api: GenApiService,
    private database:Database) { }

  ngOnInit() {
    this.getMessages(this.api.uuid);
    this.tutorial = true;
  }
  
  newMessage(){
    this.messages=[];
    this.indexMessage= null;
    this.tutorial=false;
    this.setMessage({ role: "assistant", content: "Hola Bienvenido a la IA Scan Drive" }, true);
  }

  getMessages(route:any){
    // this.showLoadData = true;
    const startConfig = ref(this.database, route);
    onValue(startConfig, (snapshot)=>{
      console.log(snapshot.val());
      if(snapshot.val() && snapshot){
      this.listMessages = Object.keys(snapshot.val());
      console.log(this.listMessages);
      const _parseData = [];
        for(let i=0; i<this.listMessages.length; i++){
          _parseData.push(...[{
            id: this.listMessages[i],
            messages: snapshot.val()[this.listMessages[i]].message
          }])
        }
        this.listMessages = _parseData;
      }
      console.log(this.listMessages);
      this.showLoadData=false;
    });
  }

  onClickMessage(index:any){
    if(this.listChatDisable){
      return;
    }
        this.tutorial=false;
        this.indexMessage = index;
        const startConfig = ref(this.database, this.api.uuid+'/'+index);
        onValue(startConfig, (snapshot)=>{
          if(snapshot.val() && snapshot){
            this.messages = snapshot.val()?.message;
            this.listChatDisable = false;
          }
          this.showLoadData=false;
          this.scrollDiv();
        });
  }

  sendMessage(message: string) {
    if(this.tutorial){
      this.newMessage();
      this.indexMessage = this.listMessages[this.listMessages.length-1].id;
    }
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
    this.listChatDisable = true;
    this.showLoadData = true;
    Object.assign(data, await this.api.generateChat(message));
    this.setMessage(data);
    if (data) {
      this.showLoadData = false;
      this.scrollDiv();
      this.isClickeable = true;
    }
    // this.data.push(...[{role:data.role, message:data.content}]);
    console.log(this.messages)
  }


  setMessage(data: { role: string, content: string }, isNew:Boolean = false) {
    this.messages.push(...[{ role: data.role, message: data.content }]);
    this.api.setMessage(this.messages, this.indexMessage , isNew);
  }

  scrollDiv() {
    setTimeout(() => {
      this.divChat.nativeElement.scrollTop = 9999;
    }, 100)
  }


}
