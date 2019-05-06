import { Component, OnInit, Input } from '@angular/core';
import {ModalController, Events} from '@ionic/angular';
import { ToDoItem, ToDoList } from './../../classes/item.class';
import { ListItemModal } from './list.item.modal';
@Component({

  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  modal: any;
  data: any;
  user: any;
  itemList: ToDoList;
  signedIn: boolean;

  constructor(
    public modalController: ModalController,
    events: Events
  ) {
    events.subscribe('data:AuthState', async (data) => {
      if (data.loggedIn) {
        this.getItems();
      } else {
        // this.itemList.items = [];
      }
    });
  }

  async ngOnInit() {
    this.getItems();
  }

  async modify(item, i) {
    let props = {
      itemList: this.itemList,
      editItem: item || undefined
    };

    this.modal = await this.modalController.create({
      component: ListItemModal,
      componentProps: props
    });

    this.modal.onDidDismiss( (result) => {
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
  }

  complete(i) {
    this.itemList.items[i].status = 'complete';
  }

  save(list){
    // Use AWS Amplify to save the list...
    // this.itemList = list;
  }

  getItems() {
    this.itemList = {
      userId: 1,
      items: [
        new ToDoItem({
          id: '1',
          title: 'test item 1',
          description: 'my test item',
          status: 'complete'
        }),
        new ToDoItem({
          id: '2',
          title: 'test item 3',
          description: 'my other test item',
          status: 'pending'
        })
      ]
    }
  }
}
