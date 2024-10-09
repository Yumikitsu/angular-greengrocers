import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './models/item';
import { Cart } from './models/cart';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-green-grocers';
  groceries: Item[] = [];
  cart: Cart[] = [];
  apiUrl:string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getGroceries().subscribe((data: Item[]) => {
      this.groceries = data;
    })
  }

  getGroceries(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  addToCart(item: Item): void {
    const existingItem = this.cart.find(cart => cart.item.id === item.id);
    if(existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ item, quantity: 1 });
    }
  }

  decreaseItem(id: string): void {
    const item = this.cart.find(cart => cart.item.id === id);
    if(item) {
      item.quantity--;
      if(item.quantity === 0) {
        this.cart = this.cart.filter(cart => cart.item.id !== id);
      }
    }
  }

  increaseItem(id: string): void {
    const item = this.cart.find(cart => cart.item.id === id);
    if(item) {
      item.quantity++;
    }
  }

  getCartSum(): number {
    return this.cart.reduce((total, cart) => total + cart.item.price * cart.quantity, 0);
  }

}
