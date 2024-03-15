import { animate, state, style, transition, trigger } from '@angular/animations';
import { EventEmitter } from '@angular/core';
import { AfterViewInit, Component, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavService } from '../nav.service';

export interface TweetData {
  RowKey: string;
  createdDate: string;
  createdBy: string;
  tweetName: string;
  status: string;
  error: string;
  originalRequest: string;
  elapsedSeconds: number;
  request: string;
}

@Component({
  selector: 'app-tweets-table',
  templateUrl: './tweets-table.component.html',
  styleUrls: ['./tweets-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TweetsTableComponent implements AfterViewInit {
  displayedColumnsLarge: string[] = [
    'createdDate',
    'createdBy',
    'tweetName',
    'compkey',
    'status',
    'totalVehicles',
    'actions',
  ];
  displayedColumnsSmall: string[] = ['createdDate', 'status', 'totalVehicles'];
  get displayedColumns() {
    return this.navService.lt_md ? this.displayedColumnsSmall : this.displayedColumnsLarge;
  }
  dataSource: MatTableDataSource<TweetData>;
  expandedElement?: TweetData;
  timestamp: string = '0';
  pendingData: boolean = true;
  minCutoff = 60; // doesnt let you fetch last min of data

  @Input() set tweets(value: TweetData[] | undefined) {
    if (value) {
      this.pendingData = false;
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.sort = this.sort;
    }
  }

  @Output() rowAction: EventEmitter<RowActionEvent> = new EventEmitter<RowActionEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator = null as any;
  @ViewChild(MatSort) sort: MatSort = null as any;

  constructor(public navService: NavService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource([] as TweetData[]);
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onRowAction(row: TweetData, action: string) {
    this.rowAction.next({
      row: row,
      action: action,
      timestamp: this.timestamp,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setExpandedElement(row: TweetData) {
    this.expandedElement = row;
    this.timestamp = '0';
    this.onRowAction(row, 'diagnostics'); // preload the diagnostics on click
  }
}

export interface RowActionEvent {
  row: TweetData;
  action: string;
  timestamp: string;
}
