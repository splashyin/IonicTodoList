import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { ToDoItem, ToDoList } from './../../classes/item.class';
import { AmplifyService } from 'aws-amplify-angular';
import { ListItemModal } from './list.item.modal';
@Component({

  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  amplifyService: AmplifyService;
  modal: any;
  data: any;
  user: any;
  itemList: ToDoList | any;
  signedIn: boolean;

  constructor(
    public modalController: ModalController,
    amplify: AmplifyService,
    events: Events
  ) {
    this.amplifyService = amplify;
    events.subscribe('data:AuthState', async (data) => {
      if (data.loggedIn) {
        this.user = await this.amplifyService.auth().currentUserInfo();
        this.getItems();
      } else {
        this.itemList.items = [];
        this.user = null;
      }
    });
  }

  async ngOnInit() {
    // use amplify to get user data 
    this.user = await this.amplifyService.auth().currentUserInfo();
    this.getItems();
  }

  async modify(item, i) {
    let props = {
      itemList: this.itemList || new ToDoList({ userId: this.user.id }),
      editItem: item || undefined
    };

    this.modal = await this.modalController.create({
      component: ListItemModal,
      componentProps: props
    });

    this.modal.onDidDismiss().then((result) => {
      if (result.data.newItem) {
        result.data.itemList.items.push(result.data.newItem);
      } else if (result.data.editItem) {
        result.data.itemList.items[i] = result.data.editItem;
      }
      this.save(result.data.itemList);
    });
    return this.modal.present();
  }

  delete(i) {
    this.itemList.items.splice(i, 1);
    this.save(this.itemList);

  }

  complete(i) {
    this.itemList.items[i].status = 'complete';
    this.save(this.itemList);

  }

  save(list) {
    // Use AWS Amplify to save the list...
    this.amplifyService.api().post('yinhaoToDoItemsCRUDtest', '/ToDoItems', { body: list }).then((i) => {
      this.getItems();
    })
      .catch((err) => {
        console.log('Error saving list: ${err}');
      });
  }

  getItems() {
    if (this.user) {
      this.amplifyService.api().get('yinhaoToDoItemsCRUDtest', `/ToDoItems/${this.user.id}`, {}).then((res) => {
        if (res && res.length > 0) {
          this.itemList = res[0];
        } else {
          this.itemList = new ToDoList({ userId: this.user.id, items: [] });
        }
      })
        .catch((err) => {
          console.log('Error getting list: ${err}');
        });
    } else {
      console.log('Cannot get items: no active user');
    }

  }

}
