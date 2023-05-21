import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/interface';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})

export class ChatListComponent implements OnInit{
  @Input() role:string = "";
  @Input() message:string = "";

  ngOnInit(): void {
  }

}
