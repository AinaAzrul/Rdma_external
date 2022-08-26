import {
  Component,
  AfterViewInit,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { AppService } from "../../app.service";
import { RestService } from "../../rest.service";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import heat from "../../../assets/js/chart_data.json";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: "donut-chart",
  templateUrl: "./donut-chart.component.html",
  styleUrls: ["./donut-chart.component.scss"],
})
export class DonutChartComponent implements OnInit, OnDestroy {
  // @Input() name: any;
  // @Input() values: any;
  // @Input() value: any;
  // @Input() category: any;
  // @Input() cid: any;
  // @Input() clickroute: any;
  // @Input() label: any;

  //data1
  data = [
    {
      assettype: "Electrical - Lighting",
      value: 17426.0,
    },
    {
      assettype: "HVAC - Air Handling Unit",
      value: 58950.6,
    },
    {
      assettype: "HVAC - Fan Coil Unit",
      value: 529.9,
    },
  ];

  data2 = [
    {
      assettype: "Electrical - Lighting",
      value: "14335.00",
    },
    {
      assettype: "HVAC - Air Handling Unit",
      value: "45887.70",
    },
    {
      assettype: "HVAC - Fan Coil Unit",
      value: "421.80",
    },
  ];

  graph: any;

  clickroute: any;
  label: any;
  values: any;

  name = "Previous Month Consumption (kWh)";
  name2 = "Current Month Consumption (kWh)";
  name3 = "Energy Consumption Heatmap (kWh)";

  cid = "chartdiv1";
  cid2 = "chartdiv2";
  cid3 = "chartdiv3";

  private chart: am4charts.PieChart;
  private chart2: am4charts.XYChart;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    // if (this.chart) {
    //   this.chart.dispose();
    // }
  }

  ngAfterViewInit() {
    this.drawChart();
    this.drawChart2();
    this.drawChart3(); //ERROR RETRIEVING LOCAL JSON FILE
  }

  drawChart() {
    // Enable animations and theme
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    this.chart = am4core.create(this.cid, am4charts.PieChart);

    // Add and configure Series
    let pieSeries = this.chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "assettype";
    pieSeries.data = this.data;

    // Let's cut a hole in our Pie chart the size of 50% the radius
    this.chart.innerRadius = am4core.percent(50);

    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    // change the cursor on hover to make it apparent the object can be interacted with
    pieSeries.slices.template.cursorOverStyle = [
      {
        property: "cursor",
        value: "pointer",
      },
    ];

    pieSeries.alignLabels = false;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.labels.template.fontSize = 10;

    pieSeries.labels.template.disabled = true; // Disable labels

    let label = this.chart.chartContainer.createChild(am4core.Label);
    label.text = "76907 kWh";
    label.align = "center";
    label.x = am4core.percent(50);
    label.y = am4core.percent(50);
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 15;

    pieSeries.ticks.template.disabled = true;

    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(
      new am4core.DropShadowFilter()
    );
    shadow.opacity = 0;

    // Create hover state
    let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter());
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    // Add a legend
    // this.chart.legend = new am4charts.Legend();

    this.chart.data = this.values;
  }

  clicked() {
    if (this.clickroute) {
      this.router.navigate([this.clickroute]);
    }
  }

  drawChart2() {
    // Enable animations and theme
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    this.chart = am4core.create(this.cid2, am4charts.PieChart);

    // Add and configure Series
    let pieSeries2 = this.chart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "value";
    pieSeries2.dataFields.category = "assettype";
    pieSeries2.data = this.data2;

    // Let's cut a hole in our Pie chart the size of 50% the radius
    this.chart.innerRadius = am4core.percent(50);

    // Put a thick white border around each Slice
    pieSeries2.slices.template.stroke = am4core.color("#fff");
    pieSeries2.slices.template.strokeWidth = 2;
    pieSeries2.slices.template.strokeOpacity = 1;
    // change the cursor on hover to make it apparent the object can be interacted with
    pieSeries2.slices.template.cursorOverStyle = [
      {
        property: "cursor",
        value: "pointer",
      },
    ];

    pieSeries2.alignLabels = false;
    pieSeries2.labels.template.bent = true;
    pieSeries2.labels.template.radius = 3;
    pieSeries2.labels.template.padding(0, 0, 0, 0);
    pieSeries2.labels.template.fontSize = 10;

    pieSeries2.labels.template.disabled = true; // Disable labels

    let label = this.chart.chartContainer.createChild(am4core.Label);
    label.text = "60645 kWh";
    label.align = "center";
    label.x = am4core.percent(50);
    label.y = am4core.percent(50);
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 15;

    pieSeries2.ticks.template.disabled = true;

    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries2.slices.template.filters.push(
      new am4core.DropShadowFilter()
    );
    shadow.opacity = 0;

    // Create hover state
    let hoverState = pieSeries2.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter());
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    // Add a legend
    // this.chart.legend = new am4charts.Legend();

    this.chart.data = this.values;
  }

  drawChart3() {
    // Enable animations and theme
    am4core.useTheme(am4themes_animated);

    // Create chart2 instance
    this.chart2 = am4core.create(this.cid3, am4charts.XYChart);
    this.chart2.maskBullets = false;
    this.chart2.dataSource.url = "../../../assets/js/chart_data.json";

    let xAxis = this.chart2.xAxes.push(new am4charts.CategoryAxis());
    let yAxis = this.chart2.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = "weekday";
    yAxis.dataFields.category = "hour";

    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 40;
    xAxis.renderer.labels.template.fontSize = 10;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;
    yAxis.renderer.labels.template.fontSize = 10;

    let series = this.chart2.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "weekday";
    series.dataFields.categoryY = "hour";
    series.dataFields.value = "value";
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    let bgColor = new am4core.InterfaceColorSet().getFor("background");

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText =
      "{weekday}, {hour}: {value.workingValue.formatNumber('#.')} kWh";
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: "fill",
      min: am4core.color("#fff"),
      max: am4core.color("#3182bd"),
    });

    // heat legend
    let heatLegend = this.chart2.bottomAxesContainer.createChild(
      am4charts.HeatLegend
    );
    heatLegend.width = am4core.percent(100);
    heatLegend.series = series;
    heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    heatLegend.valueAxis.renderer.minGridDistance = 30;

    // heat legend behavior
    series.columns.template.events.on("over", function (event) {
      handleHover(event.target);
    });

    series.columns.template.events.on("hit", function (event) {
      handleHover(event.target);
    });

    function handleHover(column) {
      if (!isNaN(column.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
      } else {
        heatLegend.valueAxis.hideTooltip();
      }
    }

    series.columns.template.events.on("out", function (event) {
      heatLegend.valueAxis.hideTooltip();
    });

    this.chart2.data = this.values;
  }
}
