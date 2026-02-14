import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockUpdateService } from '../../core/services/stock-updates/stock-update.service';

@Component({
  selector: 'app-best-stocks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './best-stocks.component.html',
  styleUrls: ['./best-stocks.component.scss']
})
export class BestStocksComponent {

  
  stocks: any[] = [];
  categories: string[] = [];

  searchText: string = '';
  selectedCategory: string = '';
  selectedMarket: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  markets = ['NSE', 'BSE'];

  /* Pagination */
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private stockService: StockUpdateService,
  ) { }

  ngOnInit() {
    this.loadStocks();
    this.loadCategories();
  }

  loadStocks(page: number = 1) {

    this.currentPage = page;

    const filters: any = {
      _page: this.currentPage,
      _limit: this.pageSize
    };

    if (this.selectedCategory)
      filters.category = this.selectedCategory;

    if (this.selectedMarket)
      filters.market = this.selectedMarket;

    if (this.searchText)
      filters.stockName_like = this.searchText;

    if (this.minPrice != null)
      filters.currentPrice_gte = this.minPrice;

    if (this.maxPrice != null)
      filters.currentPrice_lte = this.maxPrice;

    this.stockService.getStocksFiltered(filters).subscribe(response => {

      this.stocks = response.body || [];

      const total = response.headers.get('X-Total-Count');

      this.totalCount = total ? Number(total) : 0;

      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      const maxPagesToShow = 5;
      let start = Math.max(this.currentPage - 2, 1);
      let end = Math.min(start + maxPagesToShow - 1, this.totalPages);
      this.pages = [];
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

    });

  }

  nextPage() {
    if (this.currentPage < this.totalPages)
      this.loadStocks(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1)
      this.loadStocks(this.currentPage - 1);
  }

  goToPage(page: number) {
    this.loadStocks(page);
  }

  loadCategories() {

    this.stockService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });

  }

}
