import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnergyUsageSummaryComponent } from "./energy-usage-summary/energy-usage-summary.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { DonutChartComponent } from "./donut-chart/donut-chart.component";

@NgModule({
  declarations: [EnergyUsageSummaryComponent, DonutChartComponent],
  imports: [CommonModule, NgbModule, FormsModule, NgSelectModule],
  exports: [EnergyUsageSummaryComponent, DonutChartComponent],
})
export class EnergyManagementModule {}
