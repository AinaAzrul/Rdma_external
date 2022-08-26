import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";

@Component({
  selector: 'carbon-emission-report',
  templateUrl: './carbon-emission-report.component.html',
  styleUrls: ['./carbon-emission-report.component.scss']
})
export class CarbonEmissionReportComponent implements OnInit, OnDestroy {

  monthRange = [];
  selectedMonth;

  dailyIndexReportChart:boolean = false;

  private chart: am4charts.XYChart;
  private chart2: am4charts.XYChart;

  constructor(private restService: RestService, private authService: AuthService, private zone: NgZone) {}

  ngOnInit() {
  	this.getCarbonReportMinMaxDate();
  }

  getCarbonReportMinMaxDate() {
      // Load Carbon report min/max dates
      this.restService.postData("getCarbonReportMinMaxDate", this.authService.getToken()).subscribe(data => {
          // Success
          if (data["status"] == 200) {
            // Copy return data into 'label' and 'value' subobjects for dropdown
            data["data"].rows.dateRange.forEach(function(element) {
            	// Don't use .push function as it doesn't trigger the ng-select change detection
            	// (https://github.com/ng-select/ng-select#change-detection)
            	this.monthRange = [...this.monthRange, {label: element, value: element}];
          	}, this);
          	// Generate initial Carbon report
		        this.selectedMonth = data["data"].rows.maxDate;
		        this.generateCarbonReport(data["data"].rows.maxDate);
          }
      });
  }

  generateCarbonReport(date) {

      // Display chart card
      this.dailyIndexReportChart = true;

      // Load Carbon report min/max dates
      this.restService.postData("generateCarbonReport", this.authService.getToken(), {date: date}).subscribe(data => {
          // Success
          if (data["status"] == 200) {
            if (this.chart) {
              this.chart.dispose();
            }
            if (this.chart2) {
              this.chart2.dispose();
            }
            this.generateDailyChart(data["data"].rows.daily);
            this.generateMonthlyChart(data["data"].rows.monthly);
          }
      });
  }

  onMonthChange(event) {
  	this.generateCarbonReport(event.value);
  }

  generateDailyChart(data) {
    this.zone.runOutsideAngular(() => {
      // Enable animations and theme
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_material);

      // Create chart instance
      this.chart = am4core.create("chartdiv1", am4charts.XYChart);
      
      // Add data
      this.chart.data = data;

      // Create axes
      let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());  
      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

      // Setting date label granularity
      dateAxis.gridIntervals.setAll([{ timeUnit: "day", count: 1 }]);
      // Change axis label positioning
      dateAxis.renderer.labels.template.rotation = 270;
      dateAxis.renderer.labels.template.verticalCenter = "middle";
      dateAxis.renderer.labels.template.horizontalCenter = "right";

      // Create series
      let series = this.chart.series.push(new am4charts.ColumnSeries());
      series.name = "value";
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "label";
      series.sequencedInterpolation = false;
      series.columns.template.tooltipText = "{dateX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      am4core.unuseTheme(am4themes_material);
    });
  }


  generateMonthlyChart(data) {
    this.zone.runOutsideAngular(() => {
      // Enable animations and theme
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_material);

      // Create chart instance
      this.chart2 = am4core.create("chartdiv2", am4charts.XYChart);

      // Add data
      this.chart2.data = data;

      // Create axes
      let dateAxis = this.chart2.xAxes.push(new am4charts.DateAxis());  
      let valueAxis = this.chart2.yAxes.push(new am4charts.ValueAxis());

      // Setting date label granularity
      dateAxis.gridIntervals.setAll([{ timeUnit: "month", count: 1 }]);
      // Change axis label positioning
      dateAxis.renderer.labels.template.rotation = 270;
      dateAxis.renderer.labels.template.verticalCenter = "middle";
      dateAxis.renderer.labels.template.horizontalCenter = "right";
      dateAxis.dateFormats.setKey("month", "MMM yyyy");

      // Create series
      let series = this.chart2.series.push(new am4charts.ColumnSeries());
      series.name = "value";
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "label";
      series.dataFields.categoryX = "label";
      series.sequencedInterpolation = false;
      series.columns.template.tooltipText = "{label}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      // Click event handler
      series.columns.template.events.on("hit", function(ev) {
        this.generateCarbonReport(ev.target.dataItem.categories["categoryX"]);
        this.selectedMonth = ev.target.dataItem.categories["categoryX"];
      }, this);

      am4core.unuseTheme(am4themes_material)
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
    });
  }

}
