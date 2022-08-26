import { array, string } from "@amcharts/amcharts4/core";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ModifyDataPointComponentComponent } from "../modify-data-point-component/modify-data-point-component.component";

@Component({
  selector: "app-data-point-multiple-tab",
  templateUrl: "./data-point-multiple-tab.component.html",
  styleUrls: ["./data-point-multiple-tab.component.scss"],
})
export class DataPointMultipleTabComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private modalService: NgbModal) {}

  @Input() rows: [];
  
  
  resultColumns: any[] = [];
  resultRows: any[] = [];
  selectedRow: any;   
  disabledEditButton = false;
  newRows:any[]=[];
  roow: any[] = [];

  ngOnInit() { 

    this.generateColumns(this.rows);
    this.generateRows(this.rows);
   
  }

  generateColumns(data) {
    
    const sheet = data[0].data[0];
    sheet.forEach((item) => {
      this.resultColumns.push({
        ori: item,
        name: this.humanize(item),
        header: this.camelize(item),
        flexGrow: 1.0,
        minWidth: 100,
      });
    });
  }

  camelize(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(match,chr)
    {
        return chr.toUpperCase();
    });
  }

  humanize(str){
   return str.replace(/(^|_)(\w)/g, function ($0, $1, $2) {
      return ($1 && ' ') + $2.toUpperCase();
    });
  }
 
  generateRows(dataRow: any) {
    dataRow = [...this.rows];

    this.resultRows = [];
    const keys = this.resultColumns.map((col) => col.header);
    const keys2 = this.resultColumns.map((col) => col.name);
    let a = dataRow[0].data[0];

    //to display data: if array consist header, shift top elem
    if(this.humanize(a.join()) === keys2.join()){
      dataRow[0].data.shift();
    }

    const test2 = dataRow[0].data;
     for (var i = 0; i < test2.length; i++) {
      var obj = {};
      for (var j = 0; j < test2[i].length; j++) {
        obj[keys[j]] = test2[i][j];
        obj['index'] = i;
      }
      this.resultRows.push(obj);
    }
  }

  updateRow() {
    let modalRef = this.modalService.open(ModifyDataPointComponentComponent);
   
    modalRef.componentInstance.data = this.selectedRow;
    modalRef.componentInstance.data2 = this.rows;
    modalRef.componentInstance.dataCol = this.resultColumns;
    //refresh table after edit
    modalRef.componentInstance.valueChange.subscribe(event => {
      this.generateRows(event);
     });
  }


  onActivate(event) {
    console.log(event);
    
    if (event.type === "click") {
      this.selectedRow = event.row;
      this.disabledEditButton = true;
    }
    event.type === "click" && event.cellElement.blur();
  }
}
