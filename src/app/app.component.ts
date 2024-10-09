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
  vegetables: Item[] = [];
  fruits: Item[] = [];
  cart: Cart[] = [];
  apiUrl:string = environment.apiUrl;
  vegetableUrl:string = 'https://boolean-uk-api-server.fly.dev/groceries?type=vegetable'
  fruitUrl:string = 'https://boolean-uk-api-server.fly.dev/groceries?type=fruit'
  filter = 0; // 0: All, 1: Vegetables, 2: Fruits
  sort = 0; // 0: None, 1: Alphabetically, 2: Price

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getGroceries(1).subscribe((data: Item[]) => {
      this.groceries = data;
    })

    this.getGroceries(2).subscribe((data: Item[]) => {
      this.vegetables = data;
    })

    this.getGroceries(3).subscribe((data: Item[]) => {
      this.fruits = data;
    })
  }

  getGroceries(id: number): Observable<Item[]> {
    if(id === 1) {
      return this.http.get<Item[]>(this.apiUrl);
    } else if (id === 2) {
      return this.http.get<Item[]>(this.vegetableUrl);
    } else {
      return this.http.get<Item[]>(this.fruitUrl);
    }
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

  filterToText(): string {
    switch(this.filter) {
      case 0: return 'All';
      case 1: return 'Vegetables';
      case 2: return 'Fruits';
      default: return 'All';
    }
  }

  sortToText(): string {
    switch (this.sort) {
      case 0: return 'None';
      case 1: return 'Alphabet';
      case 2: return 'Price';
      default: return 'None';
    }
  }

  nextFilter(): void {
    this.filter = (this.filter + 1) % 3;
  }

  nextSort(): void {
    this.sort = (this.sort + 1) % 3;
  }

  filteredList(): Item[] {
    let filtered: Item[] = this.groceries;

    if(this.filter === 1) {
      filtered = this.vegetables;
    } else if (this.filter === 2) {
      filtered = this.fruits;
    }

    if(this.sort === 0) {
      filtered = filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if(this.sort === 1) {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sort === 2) {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  }

}
