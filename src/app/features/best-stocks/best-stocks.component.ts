import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-best-stocks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './best-stocks.component.html',
  styleUrls: ['./best-stocks.component.scss']
})
export class BestStocksComponent {

  searchText: string = '';
  selectedCategory: string = '';
  selectedMarket: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  stocks = [
    {
      stockName: 'TCS',
      fullName: 'Tata Consultancy Services',
      category: 'IT',
      subCategory: 'Software Services',
      currentPrice: 4020,
      actualPrice: 4100,
      market: 'NSE'
    },
    {
      stockName: 'INFY',
      fullName: 'Infosys Limited',
      category: 'IT',
      subCategory: 'Digital Services',
      currentPrice: 1675,
      actualPrice: 1750,
      market: 'NSE'
    },
    {
      stockName: 'HDFCBANK',
      fullName: 'HDFC Bank Limited',
      category: 'Banking',
      subCategory: 'Private Bank',
      currentPrice: 1520,
      actualPrice: 1600,
      market: 'NSE'
    },
    {
      stockName: 'RELIANCE',
      fullName: 'Reliance Industries Limited',
      category: 'Energy',
      subCategory: 'Oil & Gas',
      currentPrice: 2850,
      actualPrice: 3000,
      market: 'BSE'
    },
    {
      stockName: 'TATAMOTORS',
      fullName: 'Tata Motors Limited',
      category: 'Automobile',
      subCategory: 'Passenger Vehicles',
      currentPrice: 920,
      actualPrice: 1000,
      market: 'NSE'
    }
  ];

  constructor() { }

  ngOnInit() { }

  filteredStocks() {
    return this.stocks.filter(stock => {

      const matchesSearch =
        stock.stockName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        stock.fullName.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory ? stock.category === this.selectedCategory : true;

      const matchesMarket =
        this.selectedMarket ? stock.market === this.selectedMarket : true;

      const matchesMinPrice =
        this.minPrice != null ? stock.currentPrice >= this.minPrice : true;

      const matchesMaxPrice =
        this.maxPrice != null ? stock.currentPrice <= this.maxPrice : true;

      return matchesSearch &&
             matchesCategory &&
             matchesMarket &&
             matchesMinPrice &&
             matchesMaxPrice;
    });
  }

}
