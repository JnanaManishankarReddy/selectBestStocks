import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./features/best-stocks/best-stocks.component').then(mod => mod.BestStocksComponent),
    },
    {
        path: 'create-stock',
        loadComponent: () => import('./features/create-stock/create-stock.component').then(mod => mod.CreateStockComponent),
    },
];