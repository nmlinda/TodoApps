import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { Data } from '../../provider/data';
import { Http } from '@angular/http';


@Component({
  selector: 'page-new-job',
  templateUrl: 'new-job.html',
})
export class NewJobPage {

  title:any;
  description:any;
  dueDate:any;
  id_todo:any;
  id_user:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private data : Data,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http) {

    this.data.getData().then((data) =>
    {
      console.log(data);
      this.id_user = data.id_user;
    })

    let temp = this.navParams.data;
      this.title = temp.judul;
      this.description = temp.deskripsi;
      this.dueDate = temp.duedate;
      this.id_todo = temp.id_todo;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewJobPage');
  }

  createNewJob(){
    console.log(this.dueDate)
    if(this.title && this.description && this.dueDate){
      let loading = this.loadCtrl.create({
        content: 'memuat..'
      });

      loading.present();

      //apiPost
      let input = {
        judul :this.title,
        deskripsi: this.description, 
        duedate: this.dueDate,
        id_user: this.id_user
      };
      console.log(input);
      this.http.post(this.data.BASE_URL+"/todo_create.php",input).subscribe(data => {
      let response = data.json();
      console.log(response); 
      if(response.status==200){    
        this.navCtrl.setRoot(HelloIonicPage);      
        loading.dismiss();
      }
      else if(response.status==409) {
        loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Maximum List Reached',
            message: 'delete old list or replace some',      
            buttons: ['OK']
          });
          alert.present();
          loading.dismiss();
      }
      else {
        loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Failed Creating New Job',      
            buttons: ['OK']
          });
          alert.present();      
          loading.dismiss();
      }    
      });
      //apiPost  
    }
  }

}
