import { Component, OnInit, VERSION} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { RestService } from '../../rest.service';
import { DeleteModalDataPointComponent } from '../delete-modal-data-point/delete-modal-data-point.component';

@Component({
  selector: 'app-list-data-point',
  templateUrl: './list-data-point.component.html',
  styleUrls: ['./list-data-point.component.scss']
})
export class ListDataPointComponent implements OnInit {

  name = 'Angular ' + VERSION.major;

 dataPoint: any=[];
 dataPoints: any=[];
 tab: any=[];
 dataSheet: any=[];
 dataSheets: any=[];
 sheetResult: any[]=[];
 isLoadTab = false;
 value: string = '';

  constructor(
    private restService: RestService, 
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  selectItemCoverages(index: number) {
    this.openCoverages = this.openCoverages && this.indexSelectedCoverage === index ? false : true;
    this.indexSelectedCoverage = index;
  }

 openCoverages = false;
 indexSelectedCoverage = 1;
  ngOnInit() {
    this.getDataPoint();
    this.tab.forEach((tab:any) => {
      tab.isExpanded = false;
    });
  }


  getDataPoint() {

    this.restService.postData("getDataPoint", this.authService.getToken())
    .subscribe(data => {
      if (data["status"] == 200) {        
        //map data received from backend into one array that contains sheet data
        this.tab = [];
        const idfile= [...Array.from(new Set(data["data"].rows.map(i=>i.id)))];
      
        idfile.forEach((id) => {
        let res = data["data"].rows.filter((sheet_name) => sheet_name.id == id);
        let res2 = data["data"].rows.filter((sheet_data) => sheet_data.id == id);
        let res3 = data["data"].rows.filter((sheet_id) => sheet_id.id == id);
        
        this.tab.push({id, sheet_name: res.length > 1 ?
        res.map(i => i.sheet_name) :(res[0].sheet_name).split(), sheet_data: res2.length > 1 ?
        res2.map(i => i.sheet_data) :res2[0].sheet_data, sheet_id: res3.length > 1 ?
        res3.map(i => i.sheet_id) :(res3[0].sheet_id).split(), facility_name: res.map(i => i.facility_name)[0], service_name: res.map(i => i.service_name)[0], file_name: res.map(i => i.file_name)[0]} )
      });
      }
    });
    return this.tab;
  }

  detail(tab:any) {  

    this.dataSheet = (JSON.parse(JSON.stringify(tab)));
    this.dataSheets = JSON.parse(JSON.stringify(this.dataSheet.sheet_data));
    const sheet = this.dataSheet.sheet_id.length;

    //if file contains only one sheet/tab
    if(sheet === 1){
      const rows =JSON.parse(this.dataSheets);
      rows.push({sheet_id:this.dataSheet.sheet_id[0]});
      this.sheetResult = rows;
  }

  //if file contains multiple sheets/tabs
  else{
    this.sheetResult=[];
    //loop through the sheets to seperate the sheets in one array
    for (var i = 0; i < this.dataSheets.length; i++) {
      const rows = JSON.parse(this.dataSheets[i]); 
      rows.push({sheet_id:this.dataSheet.sheet_id[i]});
      this.sheetResult.push(rows);
  }}
  
    // //one sheet data
    // console.log(this.dataSheet); 
    // //array of tab datas
    // console.log(this.dataSheets);
    // //parsed tab datas in one array
    // console.log(this.sheetResult);

    this.isLoadTab = true;
  }

  redirectBackUrl() {
    this.isLoadTab = !this.isLoadTab;
    this.getDataPoint()
  }

  deleteData(id:any) {    
   
    const selectedData = this.tab.filter((el => el.id == id ));
    var sData = [selectedData[0].id, selectedData[0].file_name];  
    let modalRef = this.modalService.open(DeleteModalDataPointComponent);  
    modalRef.componentInstance.data = sData;
    modalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteDataPoint(id);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteDataPoint(id);
      };
    });
  }

  deleteDataPoint(id:number) {

    //Delete by file id
    this.restService.postData("deleteDataPoint", this.authService.getToken(), {id: id})
    .subscribe(data => {
      if (data["status"] == 200) {
        this.getDataPoint();
      }
    });
  }

  deleteSheet( id:any ,sheet_name:any) {   
    
    //pass file id and sheet name 
    var arr=[id,sheet_name];
    const selectedData = arr; 
    let modalRef = this.modalService.open(DeleteModalDataPointComponent);  
    modalRef.componentInstance.data = selectedData;
    modalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteDataSheet(id,sheet_name);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteDataSheet(id,sheet_name);
      };
    });
  }

  deleteDataSheet(file_id:number,sheet_name:string) {

    //Delete by sheet name
    this.restService.postData("deleteDataSheet", this.authService.getToken(), {file_id: file_id , sheet_name: sheet_name})
    .subscribe(data => {
      if (data["status"] == 200) {
        this.getDataPoint();
      }
    });
  }


  isArray(sheet_name:any){
    return Array.isArray(sheet_name);
  }
  
}