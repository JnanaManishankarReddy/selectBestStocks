import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockUpdateService } from '../../core/services/stock-updates/stock-update.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-stock.component.html',
  styleUrls: ['./create-stock.component.scss']
})
export class CreateStockComponent {
  
  stockForm!: FormGroup;

  categories: string[] = [];
  newCategory = '';
  showCategoryInput = false;


  stocks: any[] = [];
  paginatedStocks: any[] = [];

  isEditMode = false;
  editId: number | null = null;

  message = '';
  messageType = '';

  markets = ['NSE', 'BSE'];

  // Pagination
  currentPage = 1;
  pageSize = 25;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private fb: FormBuilder,
    private stockService: StockUpdateService,
    private http: HttpClient

  ) {}

  ngOnInit(): void {

    this.stockForm = this.fb.group({
      stockName: ['', Validators.required],
      fullName: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      currentPrice: ['', Validators.required],
      actualPrice: ['', Validators.required],
      market: ['', Validators.required]
    });

    this.loadStocks();
    this.loadCategories();
  }

  updatePreviousData() {
    this.http.get('http://localhost:5000/update-previous')
      .subscribe((res: any) => {
        console.log(res);
        this.showMessage(res.message, 'success');
        this.loadStocks();
      });
  }


  loadStocks() {
    this.stockService.getStocks().subscribe(data => {

      this.stocks = data;

      this.totalPages = Math.ceil(this.stocks.length / this.pageSize);

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

      this.setPage(1);
    });
  }

  loadCategories() {
    this.stockService.getCategories().subscribe((data: string[]) => {
        this.categories = data;
      });
  }


  setPage(page: number) {

    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedStocks = this.stocks.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages)
      this.setPage(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1)
      this.setPage(this.currentPage - 1);
  }

  addCategory(value?: string) {

    if (value === 'cancel') {
      this.showCategoryInput = false;
      this.newCategory = '';
      return;
    }

    if (!this.newCategory.trim()) return;

    if (this.categories.includes(this.newCategory)) {

      this.showMessage('Category already exists', 'danger');
      return;
    }

    this.stockService.addCategory(this.newCategory)
      .subscribe(() => {

        this.showMessage('Category added successfully', 'success');

        this.newCategory = '';
        this.showCategoryInput = false;

        this.loadCategories();
      });
  }


  saveStock() {

    if (this.stockForm.invalid) return;

    const formValue = this.stockForm.value;

    const duplicate = this.stocks.find(s =>
      s.stockName.toLowerCase() === formValue.stockName.toLowerCase()
      && s.id !== this.editId
    );

    if (duplicate) {
      this.showMessage('Stock already exists!', 'danger');
      return;
    }

    if (this.isEditMode) {

      this.stockService.updateStock(this.editId!, formValue)
        .subscribe(() => {
          this.showMessage('Stock updated successfully!', 'success');
          this.resetForm();
          this.loadStocks();
        });

    } else {

      this.stockService.addStock(formValue)
        .subscribe(() => {
          this.showMessage('Stock created successfully!', 'success');
          this.resetForm();
          this.loadStocks();
        });
    }
  }

  editStock(stock: any) {

    this.isEditMode = true;
    this.editId = stock.id;

    this.stockForm.patchValue(stock);
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {

    this.stockForm.reset();

    this.isEditMode = false;
    this.editId = null;
  }

  showMessage(msg: string, type: string) {

    this.message = msg;
    this.messageType = type;

    setTimeout(() => this.message = '', 3000);
  }


}
