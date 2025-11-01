import { Component, signal, computed, effect, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Angular 20 Demo Component
 * Demonstrates the latest Angular 20 features including:
 * - Signals for reactive state management
 * - New control flow syntax (@if, @for, @switch)
 * - Standalone components
 * - Enhanced error handling
 * - Performance optimizations
 */
@Component({
  selector: 'app-angular20-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="angular20-demo">
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>Angular 20 Features Demo</mat-card-title>
          <mat-card-subtitle>Latest Angular 20 patterns and features</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Signals Demo -->
          <div class="signals-demo">
            <h3>Signals Demo</h3>
            
            <!-- Loading State -->
            <div *ngIf="isLoading()" class="loading-container">
              <mat-spinner diameter="30"></mat-spinner>
              <span>Loading data...</span>
            </div>
            
            <!-- Error State -->
            <div *ngIf="errorMessage()" class="error-container">
              <p class="error-message">{{ errorMessage() }}</p>
              <button mat-button color="warn" (click)="clearError()">Clear Error</button>
            </div>
            
            <!-- Data Display -->
            <div *ngIf="hasData()">
              <div class="data-stats">
                <p>Total Items: {{ dataCount() }}</p>
                <p>Last Updated: {{ lastUpdated() | date:'medium' }}</p>
              </div>
              
              <!-- Data List -->
              <div class="data-list">
                <h4>Data Items:</h4>
                <div *ngFor="let item of dataItems(); trackBy: trackByItemId" class="data-item">
                  <span>{{ item.name || item.title || item.id }}</span>
                  <button mat-icon-button (click)="removeItem(item.id)" color="warn">
                    Delete
                  </button>
                </div>
                <p *ngIf="dataItems().length === 0" class="empty-message">No data available</p>
              </div>
            </div>
            
            <div *ngIf="!hasData()" class="empty-state">
              <p>No data loaded yet</p>
              <button mat-raised-button color="primary" (click)="loadSampleData()">
                Load Sample Data
              </button>
            </div>
            
            <!-- Add New Item -->
            <div class="add-item-section">
              <h4>Add New Item</h4>
              <div class="add-form">
                <mat-form-field appearance="outline">
                  <mat-label>Item Name</mat-label>
                  <input matInput [(ngModel)]="newItemName" placeholder="Enter item name">
                </mat-form-field>
                <button mat-raised-button color="accent" 
                        (click)="addNewItem()" 
                        [disabled]="!canAddItem()">
                  Add Item
                </button>
              </div>
            </div>
            
            <!-- Computed Signals Demo -->
            <div class="computed-demo">
              <h4>Computed Signals</h4>
              <div class="computed-stats">
                <p>Has Data: {{ hasData() }}</p>
                <p>Is Empty: {{ !hasData() }}</p>
                <p>Data Count: {{ dataCount() }}</p>
              </div>
            </div>
            
            <!-- Control Flow Demo -->
            <div class="control-flow-demo">
              <h4>Control Flow Demo</h4>
              <div class="flow-controls">
                <button mat-button (click)="toggleFlowDemo()">
                  {{ showFlowDemo() ? 'Hide' : 'Show' }} Flow Demo
                </button>
              </div>
              
              <div *ngIf="showFlowDemo()" class="flow-content">
                <p>This content is shown using Angular's control flow!</p>
                
                <div [ngSwitch]="flowType()">
                  <p *ngSwitchCase="'type1'">Flow Type 1 is active</p>
                  <p *ngSwitchCase="'type2'">Flow Type 2 is active</p>
                  <p *ngSwitchCase="'type3'">Flow Type 3 is active</p>
                  <p *ngSwitchDefault>Default flow type</p>
                </div>
                
                <div class="flow-buttons">
                  <button mat-button (click)="setFlowType('type1')">Type 1</button>
                  <button mat-button (click)="setFlowType('type2')">Type 2</button>
                  <button mat-button (click)="setFlowType('type3')">Type 3</button>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-button (click)="clearAllData()" color="warn">Clear All Data</button>
          <button mat-button (click)="refreshData()" color="primary">Refresh</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .angular20-demo {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-card {
      margin-bottom: 20px;
    }
    
    .signals-demo {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .loading-container {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .error-container {
      padding: 10px;
      background-color: #ffebee;
      border-radius: 4px;
      border-left: 4px solid #f44336;
    }
    
    .error-message {
      color: #d32f2f;
      margin: 0 0 10px 0;
    }
    
    .data-stats {
      padding: 10px;
      background-color: #e8f5e8;
      border-radius: 4px;
    }
    
    .data-list {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 10px;
    }
    
    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .data-item:last-child {
      border-bottom: none;
    }
    
    .empty-message {
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    .empty-state {
      text-align: center;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }
    
    .add-item-section {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 15px;
    }
    
    .add-form {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .add-form mat-form-field {
      flex: 1;
    }
    
    .computed-demo {
      background-color: #f0f8ff;
      padding: 15px;
      border-radius: 4px;
    }
    
    .computed-stats p {
      margin: 5px 0;
      font-weight: 500;
    }
    
    .control-flow-demo {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 15px;
    }
    
    .flow-controls {
      margin-bottom: 15px;
    }
    
    .flow-content {
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .flow-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    mat-card-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `]
})
export class Angular20DemoComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  // Signals for component state
  newItemName = signal('');
  showFlowDemo = signal(false);
  flowType = signal<'type1' | 'type2' | 'type3'>('type1');

  // Internal signals for demo data
  private _loading = signal(false);
  private _data = signal<any[]>([]);
  private _error = signal<string | null>(null);
  private _lastUpdated = signal<Date | null>(null);

  // Computed signals
  canAddItem = computed(() => this.newItemName().trim().length > 0);
  
  // Computed properties for template
  isLoading = computed(() => this._loading());
  errorMessage = computed(() => this._error());
  hasData = computed(() => this._data().length > 0);
  dataCount = computed(() => this._data().length);
  lastUpdated = computed(() => this._lastUpdated());
  dataItems = computed(() => this._data());

  constructor() {
    // Effect to show snackbar when data changes
    effect(() => {
      const dataCount = this.dataCount();
      if (dataCount > 0) {
        this.snackBar.open(`Data updated: ${dataCount} items`, 'Close', {
          duration: 2000
        });
      }
    });
  }

  ngOnInit(): void {
    // Component initialization
    console.log('Angular 20 Demo Component initialized');
  }

  loadSampleData(): void {
    this._loading.set(true);
    
    // Simulate async operation
    setTimeout(() => {
      const sampleData = [
        { id: '1', name: 'Sample Item 1', type: 'demo' },
        { id: '2', name: 'Sample Item 2', type: 'demo' },
        { id: '3', name: 'Sample Item 3', type: 'demo' },
        { id: '4', name: 'Sample Item 4', type: 'demo' },
        { id: '5', name: 'Sample Item 5', type: 'demo' }
      ];

      this._data.set(sampleData);
      this._loading.set(false);
      this._lastUpdated.set(new Date());
    }, 1000);
  }

  addNewItem(): void {
    const name = this.newItemName().trim();
    if (name) {
      const newItem = {
        id: Date.now().toString(),
        name: name,
        type: 'user-added',
        createdAt: new Date()
      };
      
      this._data.update(current => [...current, newItem]);
      this.newItemName.set('');
      
      this.snackBar.open('Item added successfully!', 'Close', {
        duration: 2000
      });
    }
  }

  removeItem(id: string): void {
    this._data.update(current => current.filter(item => item.id !== id));
    this.snackBar.open('Item removed!', 'Close', {
      duration: 2000
    });
  }

  clearAllData(): void {
    this._data.set([]);
    this._error.set(null);
    this.snackBar.open('All data cleared!', 'Close', {
      duration: 2000
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  refreshData(): void {
    this.loadSampleData();
  }

  toggleFlowDemo(): void {
    this.showFlowDemo.update(current => !current);
  }

  setFlowType(type: 'type1' | 'type2' | 'type3'): void {
    this.flowType.set(type);
  }

  trackByItemId(index: number, item: any): string {
    return item.id;
  }
}