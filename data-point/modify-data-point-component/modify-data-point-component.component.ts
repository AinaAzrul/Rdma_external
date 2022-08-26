import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl} from '@angular/forms';
import { Data } from '@angular/router';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { array } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-modify-data-point-component',
  templateUrl: './modify-data-point-component.component.html',
  styleUrls: ['./modify-data-point-component.component.scss']
})
export class ModifyDataPointComponentComponent implements OnInit {

  @Input() data: any;    //row data to get row index array
  @Input() data2: any;   //Array sheet_data $ sheet_id
  @Input() dataCol: any; //header
  @Output() valueChange = new EventEmitter();

  row: any[]=[];
  result: any[]=[];
  Column: any[] = [];
  public formGroup = new FormGroup({});
  constructor(public activeModal: NgbActiveModal, private restService: RestService, private authService: AuthService) { }

  ngOnInit() {
    this.generateForm();
  }

  generateForm(){
    
    //Data representation
    let colData = [];
    for (const item of this.dataCol) {
      colData.push({label: item.name})
    }

    //destructuring to remove "index" element in row array
    const {index, ...newData} = this.data;

    //map row data and header name into one array
    let rows = [];
    rows = Object.values(newData);
    const formattedData = (colData, rows) => colData.map((obj, i) => (  
      {...obj, data: rows[i]}
    ));
    
    this.row = formattedData(colData, rows);
    
    //form input
    for (const item of this.row) {
      this.formGroup.addControl(item.label, new FormControl(item.data));
    }
  }

  update() {
    
    let sheet_id = this.data2[1].sheet_id;
    let edit2 = Object.values(this.formGroup.value); //values of the form data
    let indx = this.data.index;

    let newData= [];
    newData.push(this.data2[0]);

    // //update by row index
    newData[0].data.splice(indx,1,edit2);

    //call function api update
    this.updateRow(sheet_id);
    
  }

  deleteRow(){
    
    //Delete by row index
    this.data2[0].data.splice(this.data.index,1);
    this.result = [];
    this.result.push(this.data2[0]);
    this.Column = Object.keys(this.formGroup.value);
    this.updateRow(this.data2[1].sheet_id);
  }

  updateRow(sheet_id){

    //add header in array to pass in update backend
    let Column = [];
    for (const item of this.dataCol) {
      Column.push(item.ori);
    }

    
    var final = [];
    final = JSON.parse(JSON.stringify(this.data2));
    
    //add header in beginning of array
    final[0].data.unshift(Column);

    //send event to parent component 
    this.valueChange.emit(this.data2);
    //Update existing rule
    this.restService.postData("updateDataSheet", this.authService.getToken(), {sheet_data: final, sheet_id: sheet_id})
    .subscribe(data => {
    // Successful update
    if (data["status"] == 200) {
      this.formGroup.reset();
      this.activeModal.close('Modal Closed');
    }
   });

  }



}