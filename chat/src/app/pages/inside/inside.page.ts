import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
const STORAGE_KEY = 'MYID';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
   data = '';
  email = '';
  users = null;
  toastController: any;

  constructor(private authService: AuthService,
    private storage: Storage,
    private toastCtrl: ToastController,
     public actionSheetController: ActionSheetController,
     private socket: Socket) {
     console.log('constrcuctor');

  }

  ngOnInit() {
    this.authService.getSpecialData().subscribe(res => {
      this.email = res['msg'].email;
      this.data = res['msg'];
      this.storage.set(STORAGE_KEY, res['msg'].email);
      this.socket.connect();
    this.socket.emit('set-name', this.email);
    });

    this.authService.getUsers().subscribe(res => {
      console.log(res);
      this.users = res;

    });

    this.socket.fromEvent('users-changed').subscribe(data => {
      const user = data['user'];
console.log(user !== this.email);
      if (user !== this.email) {
  if (data['event'] === 'left') {
    this.showToast('User left: ' + user);
  } else {
    this.showToast('User joined: ' + user);
  }
}

    });



  }

  ionViewWillLeave() {
    this.socket.emit('disconnect', this.email);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Log out',
        role: 'destructive',
        icon: 'power',
        handler: () => {
          this.logout();
        }
      }, {
        text: 'Create Room',
        icon: 'people',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Notes',
        icon: 'paper',
        handler: () => {
          console.log('clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  logout() {
    this.socket.emit('disconnect', this.email);
    this.authService.logout();
  }


  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}
