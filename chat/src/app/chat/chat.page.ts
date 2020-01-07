import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private socket: Socket) { 
    this.authService.getSpecialData().subscribe(res => {
      this.from = res['msg'].email;
    });
    this.to = this.activatedRoute.snapshot.paramMap.get('id');
  }
   to = '';
   message = '';
   from = '';
   messages = null;
  ngOnInit() {
 const data = {
  to : this.to
 }
 console.log(data);
    this.authService.getMessages(data).subscribe(res => {
      this.messages = res;
    });

    this.socket.fromEvent('message').subscribe(message => {
      this.authService.getMessages(data).subscribe(res => {
        this.messages = res;
      });
    })
  }

  sendMessage() {
    this.socket.emit('send-message', {to: this.to, message: this.message , from: this.from});
    this.message = '';
  }

  }

