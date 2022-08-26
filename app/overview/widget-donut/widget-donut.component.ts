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

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: "widget-donut",
  templateUrl: "./widget-donut.component.html",
  styleUrls: ["./widget-donut.component.scss"],
})
export class WidgetDonutComponent implements OnInit, OnDestroy {
  // @Input() name: any;
  // @Input() values: any;
  // @Input() value: any;
  // @Input() category: any;
  // @Input() cid: any;
  // @Input() clickroute: any;
  // @Input() label: any;

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

  name = "Previous Month Consumption (kWh)";
  values: any;
  value = ["17426.0", "58950.6", "529.9"];
  category = [
    "Electrical - Lighting",
    "HVAC - Air Handling Unit",
    "HVAC - Fan Coil Unit",
  ];
  cid = "chartdiv5";
  clickroute: any;
  label: any;

  private chart: am4charts.PieChart;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  ngAfterViewInit() {
    this.drawChart();
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
}
